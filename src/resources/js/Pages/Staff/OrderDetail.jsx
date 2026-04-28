import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import StaffLayout from '@/Layouts/StaffLayout';
import { Card, CardContent, Button, Badge, StatusBadge, PaymentBadge, Input, Label, Textarea, Select } from '@/Components/ui';

export default function OrderDetail({ order, invoiceToken, smsSent, hasPhone }) {
    const [showPaymentForm, setShowPaymentForm] = useState(false);
    const [notes, setNotes] = useState(order.notes || '');
    const [pendingStatus, setPendingStatus] = useState(null);
    const [photoFiles, setPhotoFiles] = useState({});
    const [uploadingPhotos, setUploadingPhotos] = useState({});
    const [uploadProgress, setUploadProgress] = useState({});
    const [smsSending, setSmsSending] = useState(null);
    const [smsMessage, setSmsMessage] = useState(null);
    const [showDispatchModal, setShowDispatchModal] = useState(false);
    const [dispatchItemType, setDispatchItemType] = useState('parcel');
    const [dispatchWeight, setDispatchWeight] = useState('0.5');
    const [dispatchSubmitting, setDispatchSubmitting] = useState(false);

    const sendSms = async (type) => {
        const routeName = type === 'ready' ? 'staff.orders.ready-sms' : 'staff.orders.invoice-sms';
        setSmsSending(type);
        setSmsMessage(null);
        try {
            const res = await window.axios.post(route(routeName, order.id));
            if (type === 'invoice') {
                router.reload({ only: ['invoiceToken', 'smsSent'] });
            } else {
                setSmsMessage({ ok: true, text: res.data.message });
            }
        } catch (err) {
            setSmsMessage({ ok: false, text: err.response?.data?.message ?? 'Network error. Try again.' });
        } finally {
            setSmsSending(null);
        }
    };

    const { data, setData, post, processing, errors } = useForm({
        amount: order.balance.toFixed(2),
        method: 'cash',
        reference: '',
        notes: '',
    });

    const handleStatusUpdate = (newStatus) => {
        router.patch(`/staff/orders/${order.id}/status`, { status: newStatus }, {
            preserveScroll: true,
            onSuccess: () => setPendingStatus(null),
        });
    };

    const handlePaymentSubmit = (e) => {
        e.preventDefault();
        post(`/staff/orders/${order.id}/payments`, {
            onSuccess: () => {
                setShowPaymentForm(false);
                setData({ amount: order.balance.toFixed(2), method: 'cash', reference: '', notes: '' });
            },
        });
    };

    const handleDispatch = (e) => {
        e.preventDefault();
        setDispatchSubmitting(true);
        router.post(`/staff/orders/${order.id}/dispatch`, {
            item_type: dispatchItemType,
            weight: parseFloat(dispatchWeight),
        }, {
            preserveScroll: true,
            onSuccess: () => setShowDispatchModal(false),
            onFinish: () => setDispatchSubmitting(false),
        });
    };

    const handleNotesUpdate = () => {
        router.patch(`/staff/orders/${order.id}/notes`, { notes }, {
            preserveScroll: true,
        });
    };

    const handlePhotoFileChange = (itemId, e) => {
        const file = e.target.files[0];
        if (!file) return;
        setPhotoFiles((prev) => ({ ...prev, [itemId]: file }));
    };

    const submitPhoto = (itemId) => {
        const file = photoFiles[itemId];
        if (!file) return;

        setUploadingPhotos((prev) => ({ ...prev, [itemId]: true }));
        setUploadProgress((prev) => ({ ...prev, [itemId]: 0 }));
        const formData = new FormData();
        formData.append('photo', file);
        formData.append('item_id', itemId);

        router.post(`/staff/orders/${order.id}/photos`, formData, {
            forceFormData: true,
            preserveScroll: true,
            onProgress: (e) => setUploadProgress((prev) => ({ ...prev, [itemId]: e.percentage })),
            onSuccess: () => {
                setPhotoFiles((prev) => { const n = { ...prev }; delete n[itemId]; return n; });
            },
            onFinish: () => {
                setUploadingPhotos((prev) => ({ ...prev, [itemId]: false }));
                setUploadProgress((prev) => { const n = { ...prev }; delete n[itemId]; return n; });
            },
        });
    };

    const canTransition = (newStatus) => {
        const transitions = {
            pending: ['processing', 'cancelled'],
            processing: ['ready', 'cancelled'],
            ready: ['delivered', 'cancelled'],
            out_for_delivery: ['delivered', 'cancelled'],
            delivered: [],
            cancelled: [],
        };
        return transitions[order.status]?.includes(newStatus) || false;
    };

    const isDeliveryOrder = order.pickup_type === 'delivery';
    const canDispatch = isDeliveryOrder && order.status === 'ready' && !order.steadfast_consignment_id;

    const statusActions = [
        { status: 'processing', label: 'Start Processing', color: 'primary' },
        { status: 'ready', label: 'Mark Ready', color: 'success' },
        { status: 'delivered', label: 'Complete Order', color: 'success' },
        { status: 'cancelled', label: 'Cancel', color: 'destructive' },
    ];

    return (
        <StaffLayout>
            <Head title={`Order ${order.order_number}`} />

            <div className="p-6 max-w-6xl mx-auto">
                <Link
                    href="/staff"
                    className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mb-6"
                >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Orders
                </Link>

                {/* Header */}
                <div className="flex items-start justify-between gap-4 mb-6">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="font-mono text-2xl font-semibold text-gray-900 dark:text-white">
                                {order.order_number}
                            </h1>
                            {order.is_awaiting_photo && (
                                <span className="inline-flex items-center gap-1.5 rounded-md border border-amber-300 bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
                                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                                    </svg>
                                    Awaiting Photo
                                </span>
                            )}
                        </div>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Created {order.created_at}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        {order.is_awaiting_photo && (
                            <Link
                                href={route('staff.orders.edit', order.id)}
                                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90"
                            >
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                </svg>
                                Edit Order
                            </Link>
                        )}
                        <StatusBadge status={order.status} />
                    </div>
                </div>

                {/* Invoice & SMS actions */}
                <div className="mb-6 flex flex-wrap items-center gap-2">
                    <a
                        href={invoiceToken ? route('invoice.public', invoiceToken) : route('orders.invoice', order.id)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-md border bg-card px-3 py-2 text-sm font-medium shadow-sm hover:bg-accent"
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Invoice
                    </a>

                    {!smsSent && (
                        <button
                            onClick={() => sendSms('invoice')}
                            disabled={smsSending !== null}
                            className="inline-flex items-center gap-1.5 rounded-md border bg-card px-3 py-2 text-sm font-medium shadow-sm hover:bg-accent disabled:opacity-50"
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                            </svg>
                            {smsSending === 'invoice' ? 'Sending…' : 'Send Invoice SMS'}
                        </button>
                    )}

                    {hasPhone && order.status === 'ready' && (
                        <button
                            onClick={() => sendSms('ready')}
                            disabled={smsSending !== null}
                            className="inline-flex items-center gap-1.5 rounded-md border bg-card px-3 py-2 text-sm font-medium shadow-sm hover:bg-accent disabled:opacity-50"
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                            </svg>
                            {smsSending === 'ready' ? 'Sending…' : 'Send Ready SMS'}
                        </button>
                    )}

                    {smsMessage && (
                        <span className={`text-sm font-medium ${smsMessage.ok ? 'text-green-600' : 'text-red-600'}`}>
                            {smsMessage.text}
                        </span>
                    )}
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* ── Left column ─────────────────────────────────── */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* 1. Update Status */}
                        {order.status !== 'delivered' && order.status !== 'cancelled' && (
                            <Card>
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-2 mb-3">
                                        <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 4.5l1.197-1.197M5.106 7.5l1.197-1.197m10.787 10.787l1.197 1.197M18.894 7.5l-1.197-1.197" />
                                        </svg>
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Update Status</span>
                                    </div>
                                    {pendingStatus ? (
                                        <div className="flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20 px-4 py-3">
                                            <svg className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                                            </svg>
                                            <span className="flex-1 text-sm font-medium text-amber-800 dark:text-amber-200">
                                                Update status to <span className="font-semibold capitalize">{pendingStatus}</span>?
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleStatusUpdate(pendingStatus)}
                                                    className="rounded-md bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-amber-700"
                                                >
                                                    Confirm
                                                </button>
                                                <button
                                                    onClick={() => setPendingStatus(null)}
                                                    className="rounded-md border px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
) : (
                                         <div className="flex flex-wrap gap-2">
                                             {statusActions.map((action) => (
                                                 canTransition(action.status) && (
                                                     <Button
                                                         key={action.status}
                                                         variant={action.color}
                                                         size="sm"
                                                         onClick={() => setPendingStatus(action.status)}
                                                     >
                                                        {action.label}
                                                    </Button>
                                                )
                                            ))}
                                            {canDispatch && (
                                                <Button
                                                    variant="primary"
                                                    size="sm"
                                                    onClick={() => setShowDispatchModal(true)}
                                                >
                                                    <svg className="mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0h3m-9 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m6 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h-6m6 0h3m-9 0h-3" />
                                                    </svg>
                                                    Dispatch via Steadfast
                                                </Button>
                                            )}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        {/* Awaiting Photo Upload — one slot per pending reprint item */}
                        {order.is_awaiting_photo && (() => {
                            const pendingItems = order.items.filter(
                                (item) => item.category === 'reprint' && (!item.photo_paths || item.photo_paths.length === 0)
                            );
                            if (pendingItems.length === 0) return null;
                            return (
                                <Card>
                                    <CardContent className="p-4">
                                        <div className="flex items-center gap-2 mb-1">
                                            <svg className="h-4 w-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                                            </svg>
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Upload Photos</span>
                                        </div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                                            {pendingItems.length} photo{pendingItems.length > 1 ? 's' : ''} needed. Upload each to generate Photo ID.
                                        </p>
                                        <div className="space-y-4">
                                            {pendingItems.map((item, idx) => (
                                                <div key={item.id} className="rounded-lg border border-dashed border-amber-300 dark:border-amber-700 p-3">
                                                    <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-2">
                                                        Photo {idx + 1} — {item.product_name} {item.size_label ? `(${item.size_label})` : ''}
                                                    </p>
                                                    <input
                                                        type="file"
                                                        accept="image/jpeg,image/png,image/jpg"
                                                        onChange={(e) => handlePhotoFileChange(item.id, e)}
                                                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                                                    />
                                                    {photoFiles[item.id] && (
                                                        <div className="flex items-center gap-3 mt-2 rounded-lg border border-gray-200 dark:border-gray-700 p-2">
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{photoFiles[item.id].name}</p>
                                                                <p className="text-xs text-gray-500 dark:text-gray-400">{(photoFiles[item.id].size / 1024 / 1024).toFixed(1)} MB</p>
                                                            </div>
                                                            <Button
                                                                variant="primary"
                                                                size="sm"
                                                                onClick={() => submitPhoto(item.id)}
                                                                disabled={uploadingPhotos[item.id]}
                                                            >
                                                                {uploadingPhotos[item.id] ? 'Uploading...' : 'Upload'}
                                                            </Button>
                                                        </div>
                                                    )}
                                                    {uploadProgress[item.id] != null && (
                                                        <div className="mt-2 rounded-lg border border-primary/20 bg-primary/5 p-3">
                                                            <div className="mb-1.5 flex items-center justify-between text-xs font-medium text-primary">
                                                                <span>Uploading photo...</span>
                                                                <span>{uploadProgress[item.id]}%</span>
                                                            </div>
                                                            <div className="w-full rounded-full bg-primary/20 h-2 overflow-hidden">
                                                                <div
                                                                    className="h-2 rounded-full bg-primary transition-all duration-200"
                                                                    style={{ width: `${uploadProgress[item.id]}%` }}
                                                                />
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })()}

                        {/* 2. Order Details (moved up) */}
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center gap-2 mb-5">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                                    </svg>
                                    <h2 className="text-base font-semibold text-gray-900 dark:text-white">Order Details</h2>
                                </div>

                                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {order.items.filter(item => item.category !== 'studio_fee').map((item) => (
                                        <div key={item.id} className="py-5 first:pt-0 last:pb-0">
                                            {/* Photo ID — per reprint item */}
                                            {item.category === 'reprint' && item.registry_code && (
                                                <div className="mb-4 flex items-center gap-2 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 px-4 py-3">
                                                    <svg className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5-3.9 19.5m-2.1-19.5-3.9 19.5" />
                                                    </svg>
                                                    <span className="text-xs text-amber-700 dark:text-amber-400 uppercase tracking-wide font-medium">Photo ID</span>
                                                    <span className="font-mono text-base font-bold text-amber-900 dark:text-amber-100 tracking-wider">
                                                        {item.registry_code}
                                                    </span>
                                                </div>
                                            )}

                                            {/* Photos — preview + download */}
                                            {item.photo_paths && item.photo_paths.length > 0 && (
                                                <div className="mb-4 flex flex-wrap gap-3">
                                                    {item.photo_paths.map((photo, i) => (
                                                        <div key={i} className="group relative">
                                                            <div className="h-28 w-24 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden bg-gray-100 dark:bg-gray-800">
                                                                <img
                                                                    // src={`/storage/${photo}`}
                                                                    src={photo}
                                                                    alt={`Photo ${i + 1}`}
                                                                    className="h-full w-full object-cover"
                                                                />
                                                            </div>
                                                            {/* Download overlay */}
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    window.location.href = `/staff/photos/download?path=${encodeURIComponent(photo)}`;
                                                                }}
                                                                className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity"
                                                                title="Download photo"
                                                            >
                                                                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Print specs */}
                                            <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                                                <div>
                                                    <span className="text-xs text-gray-500 dark:text-gray-400 block mb-0.5">Product</span>
                                                    <span className="font-medium text-gray-900 dark:text-white">{item.product_name}</span>
                                                </div>
                                                <div>
                                                    <span className="text-xs text-gray-500 dark:text-gray-400 block mb-0.5">Size</span>
                                                    <span className="font-medium text-gray-900 dark:text-white">{item.size_label}</span>
                                                </div>
                                                <div>
                                                    <span className="text-xs text-gray-500 dark:text-gray-400 block mb-0.5">Copies</span>
                                                    <span className="font-medium text-gray-900 dark:text-white">{item.quantity}</span>
                                                </div>
                                                {order.paper_type && (
                                                    <div>
                                                        <span className="text-xs text-gray-500 dark:text-gray-400 block mb-0.5">Paper Type</span>
                                                        <span className="font-medium text-gray-900 dark:text-white capitalize">{order.paper_type}</span>
                                                    </div>
                                                )}
                                                <div>
                                                    <span className="text-xs text-gray-500 dark:text-gray-400 block mb-0.5">Subtotal</span>
                                                    <span className="font-medium text-gray-900 dark:text-white">৳{item.subtotal.toFixed(0)}</span>
                                                </div>
                                            </div>

                                            {/* Photo Source / Notes for Album/Frame/Mug */}
                                            {item.photo_source && (
                                                <div className="mt-3 rounded-md bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 px-3 py-2">
                                                    <div className="flex items-start gap-2">
                                                        <svg className="h-4 w-4 shrink-0 mt-0.5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m4.243 4.243L6.75 7.5l4.243 4.243m4.5-4.5L21.75 7.5l-4.243 4.243" />
                                                        </svg>
                                                        <div className="flex-1">
                                                            <span className="text-xs font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-wide">Photo Source</span>
                                                            {item.photo_source.match(/^https?:\/\//) ? (
                                                                <a 
                                                                    href={item.photo_source} 
                                                                    target="_blank" 
                                                                    rel="noopener noreferrer"
                                                                    className="text-sm text-blue-600 dark:text-blue-400 mt-0.5 block hover:underline break-all"
                                                                >
                                                                    {item.photo_source}
                                                                </a>
                                                            ) : (
                                                                <p className="text-sm text-blue-900 dark:text-blue-100 mt-0.5 whitespace-pre-wrap">{item.photo_source}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {item.item_specific_notes && (
                                                <div className="mt-3 rounded-md bg-gray-100 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 px-3 py-2">
                                                    <span className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">
                                                        Notes for {item.category ? item.category.charAt(0).toUpperCase() + item.category.slice(1) : 'Item'}
                                                    </span>
                                                    <p className="text-sm text-gray-700 dark:text-gray-200 mt-0.5">{item.item_specific_notes}</p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {/* Pickup / Delivery info */}
                                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                    {isDeliveryOrder ? (
                                        <div className="space-y-3">
                                            <div className="flex items-start gap-2">
                                                <svg className="h-4 w-4 mt-0.5 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0h3m-9 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m6 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h-6m6 0h3m-9 0h-3" />
                                                </svg>
                                                <div>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">
                                                        Home Delivery — <span className="capitalize">{order.delivery_type || 'regular'}</span>
                                                        {order.delivery_fee > 0 && ` · ৳${order.delivery_fee.toFixed(0)}`}
                                                    </p>
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white">{order.delivery_address || '—'}</p>
                                                    {order.delivery_instructions && (
                                                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 italic">{order.delivery_instructions}</p>
                                                    )}
                                                </div>
                                            </div>
                                            {order.steadfast_tracking_code && (
                                                <div className="flex items-center gap-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 px-3 py-2">
                                                    <svg className="h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0h3m-9 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m6 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h-6m6 0h3m-9 0h-3" />
                                                    </svg>
                                                    <div>
                                                        <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">Steadfast Tracking</p>
                                                        <p className="font-mono text-sm font-bold text-blue-900 dark:text-blue-100">{order.steadfast_tracking_code}</p>
                                                        {order.steadfast_delivery_status && (
                                                            <p className="text-xs text-blue-500 dark:text-blue-300 capitalize">{order.steadfast_delivery_status.replace(/_/g, ' ')}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                            {order.location && (
                                                <div className="flex items-start gap-2">
                                                    <svg className="h-4 w-4 mt-0.5 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                                    </svg>
                                                    <div>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Dispatching Studio</p>
                                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{order.location.name}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="flex items-start gap-2">
                                            <svg className="h-4 w-4 mt-0.5 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                            </svg>
                                            <div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Pickup Location</p>
                                                <p className="text-sm font-medium text-gray-900 dark:text-white">{order.location?.name ?? '—'}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">{order.location?.address}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                                    <span className="text-sm text-gray-500 dark:text-gray-400">Order Total</span>
                                    <span className="text-lg font-semibold text-gray-900 dark:text-white">৳{order.total_amount.toFixed(0)}</span>
                                </div>
                            </CardContent>
                        </Card>

                    </div>

                    {/* ── Right sidebar ────────────────────────────────── */}
                    <div className="space-y-6">
                        {/* Payment */}
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125H15.75a.75.75 0 00-.75.75v.75" />
                                    </svg>
                                    <h2 className="text-base font-semibold text-gray-900 dark:text-white">Payment</h2>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500 dark:text-gray-400">Total</span>
                                        <span className="font-medium text-gray-900 dark:text-white">৳{order.total_amount.toFixed(0)}</span>
                                    </div>
                                    {order.discount_amount > 0 && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500 dark:text-gray-400">Discount</span>
                                            <span className="font-medium text-emerald-600 dark:text-emerald-400">−৳{order.discount_amount.toFixed(0)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500 dark:text-gray-400">Paid</span>
                                        <span className="font-medium text-emerald-600 dark:text-emerald-400">৳{order.amount_paid.toFixed(0)}</span>
                                    </div>
                                    {order.balance > 0 && (
                                        <div className="flex justify-between text-sm pt-2 border-t border-gray-200 dark:border-gray-700">
                                            <span className="text-gray-500 dark:text-gray-400">Balance Due</span>
                                            <span className="font-medium text-red-600 dark:text-red-400">৳{order.balance.toFixed(0)}</span>
                                        </div>
                                    )}
                                    <div className="pt-2">
                                        <PaymentBadge status={order.payment_status} />
                                    </div>
                                </div>

                                {order.balance > 0 && (
                                    <Button variant="primary" className="w-full mt-4" onClick={() => setShowPaymentForm(true)}>
                                        Record Payment
                                    </Button>
                                )}

                                {order.payments.length > 0 && (
                                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Payment History</p>
                                        <div className="space-y-2">
                                            {order.payments.map((payment) => (
                                                <div key={payment.id} className="rounded-lg bg-gray-50 dark:bg-gray-700/50 p-2.5">
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-gray-500 dark:text-gray-400">{payment.paid_at}</span>
                                                        <span className="font-medium text-gray-900 dark:text-white">৳{payment.amount.toFixed(0)}</span>
                                                    </div>
                                                    <p className="text-xs text-gray-400 mt-0.5">
                                                        {payment.method.charAt(0).toUpperCase() + payment.method.slice(1)}
                                                        {payment.reference && ` · ${payment.reference}`}
                                                        {payment.recorded_by !== 'System' && ` · by ${payment.recorded_by}`}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Customer */}
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                    </svg>
                                    <h2 className="text-base font-semibold text-gray-900 dark:text-white">Customer</h2>
                                </div>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Name</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{order.user.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Email</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white break-all">{order.user.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Phone</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{order.user.phone || 'Not provided'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Home Address</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{order.user.address || 'Not provided'}</p>
                                    </div>
                                </div>
                                {order.special_instructions && (
                                    <div className="mt-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-3">
                                        <p className="text-xs font-medium text-amber-800 dark:text-amber-200 mb-1">Special Instructions</p>
                                        <p className="text-sm text-amber-900 dark:text-amber-100">{order.special_instructions}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Staff Notes */}
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                    </svg>
                                    <h2 className="text-base font-semibold text-gray-900 dark:text-white">Staff Notes</h2>
                                </div>
                                <Textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    onBlur={handleNotesUpdate}
                                    rows={3}
                                    placeholder="Add internal notes visible only to staff..."
                                />
                                <p className="mt-2 text-xs text-gray-400">Notes are saved automatically on blur</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Dispatch modal */}
            {showDispatchModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <Card className="w-full max-w-md">
                        <CardContent className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Dispatch via Steadfast</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                Delivery to: <span className="font-medium text-gray-700 dark:text-gray-200">{order.delivery_address}</span>
                            </p>
                            <form onSubmit={handleDispatch} className="space-y-4">
                                <div>
                                    <Label>Item Type</Label>
                                    <Select
                                        value={dispatchItemType}
                                        onChange={(e) => setDispatchItemType(e.target.value)}
                                    >
                                        <option value="document">Document</option>
                                        <option value="parcel">Parcel</option>
                                        <option value="other">Other</option>
                                    </Select>
                                </div>
                                <div>
                                    <Label>Weight (kg)</Label>
                                    <Input
                                        type="number"
                                        step="0.1"
                                        min="0.1"
                                        max="50"
                                        value={dispatchWeight}
                                        onChange={(e) => setDispatchWeight(e.target.value)}
                                    />
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <Button type="button" variant="outline" className="flex-1" onClick={() => setShowDispatchModal(false)}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" variant="primary" className="flex-1" disabled={dispatchSubmitting}>
                                        {dispatchSubmitting ? 'Dispatching…' : 'Dispatch'}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Payment modal */}
            {showPaymentForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <Card className="w-full max-w-md">
                        <CardContent className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Record Payment</h3>
                            <form onSubmit={handlePaymentSubmit} className="space-y-4">
                                <div>
                                    <Label>Amount (৳)</Label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        min="1"
                                        max={order.balance}
                                        value={data.amount}
                                        onChange={(e) => setData('amount', e.target.value)}
                                    />
                                    {errors.amount && <p className="mt-1 text-sm text-red-500">{errors.amount}</p>}
                                </div>

                                <div>
                                    <Label>Payment Method</Label>
                                    <Select
                                        value={data.method}
                                        onChange={(e) => setData('method', e.target.value)}
                                    >
                                        <option value="cash">Cash</option>
                                        <option value="bkash">bKash</option>
                                        <option value="nagad">Nagad</option>
                                        <option value="card">Card</option>
                                        <option value="other">Other</option>
                                    </Select>
                                </div>

                                {(data.method === 'bkash' || data.method === 'nagad') && (
                                    <div>
                                        <Label>Transaction ID</Label>
                                        <Input
                                            type="text"
                                            value={data.reference}
                                            onChange={(e) => setData('reference', e.target.value)}
                                            placeholder="Enter transaction ID"
                                        />
                                    </div>
                                )}

                                <div>
                                    <Label>Notes (optional)</Label>
                                    <Textarea
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        rows={2}
                                    />
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <Button type="button" variant="outline" className="flex-1" onClick={() => setShowPaymentForm(false)}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" variant="primary" className="flex-1" disabled={processing}>
                                        {processing ? 'Saving...' : 'Record Payment'}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            )}
        </StaffLayout>
    );
}
