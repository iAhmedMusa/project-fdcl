import StaffLayout from '@/Layouts/StaffLayout';
import { Head, Link, router } from '@inertiajs/react';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';

const SERVICES = [
    { id: 'reprint', name: 'Photo Print', description: 'Photo prints from FDCL Photo ID or customer upload', icon: 'reprint' },
    { id: 'album', name: 'Album', description: 'Photo albums with custom designs', icon: 'album' },
    { id: 'frame', name: 'Frame', description: 'Photo frames in various sizes', icon: 'frame' },
    { id: 'mug', name: 'Mug', description: 'Custom photo mugs', icon: 'mug' },
];

const INPUT = 'mt-1 block w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring';
const LABEL = 'block text-sm font-medium text-foreground';
const ERR = 'mt-1 text-xs text-destructive';

function ServiceIcon({ type, className }) {
    const icons = {
        reprint: (
            <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18.75 12h.008v.008h-.008V12ZM8.25 12h.008v.008H8.25V12Z" />
            </svg>
        ),
        album: (
            <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18c-2.305 0-4.408.867-6 2.292m0-14.25v14.25" />
            </svg>
        ),
        frame: (
            <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
            </svg>
        ),
        mug: (
            <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597-.237 1.17-.659 1.591L10 14.5m4.25-11.382c.251.023.501.05.75.082M19 8.25a2.25 2.25 0 0 1 2.25 2.25v.75a2.25 2.25 0 0 1-2.25 2.25h-.5m-13.5 0v3.75a4.5 4.5 0 0 0 4.5 4.5h6a4.5 4.5 0 0 0 4.5-4.5v-3.75m-13.5 0h13.5" />
            </svg>
        ),
    };
    return icons[type] || null;
}

function StepHeader({ number, title, isComplete, isActive }) {
    return (
        <div className="flex items-center gap-2">
            <div className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                isComplete
                    ? 'bg-primary text-white'
                    : isActive
                        ? 'bg-primary text-white'
                        : 'bg-gray-200 text-gray-400'
            }`}>
                {isComplete ? (
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                ) : (
                    number
                )}
            </div>
            <span className={`text-sm font-medium ${isActive || isComplete ? 'text-gray-900' : 'text-gray-400'}`}>
                {title}
            </span>
        </div>
    );
}

export default function CreateOrder({ products, locations }) {
    // ── Step 1: Customer ──────────────────────────────────────
    const [customerType, setCustomerType] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searching, setSearching] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [customerEmail, setCustomerEmail] = useState('');

    // ── Photo Registries ─────────────────────────────────────
    const [customerRegistries, setCustomerRegistries] = useState([]);
    const [loadingRegistries, setLoadingRegistries] = useState(false);

    // ── Step 2: Services ───────────────────────────────────────
    const [selectedServices, setSelectedServices] = useState(new Set());

    // ── Step 3: Reprint details ──────────────────────────────
    const [reprintSource, setReprintSource] = useState('registry');
    const [selectedRegistry, setSelectedRegistry] = useState(null);
    const [manualPhotoId, setManualPhotoId] = useState('');
    const [manualPhotoError, setManualPhotoError] = useState('');
    const [manualPhotoData, setManualPhotoData] = useState(null);
    const [manualPhotoLookingUp, setManualPhotoLookingUp] = useState(false);
    const [reprintFile, setReprintFile] = useState(null);
    const [reprintPreview, setReprintPreview] = useState(null);
    const [reprintProduct, setReprintProduct] = useState('');
    const [reprintQuantity, setReprintQuantity] = useState(1);
    const [reprintPaperType, setReprintPaperType] = useState('glossy');
    const [shareConfirmation, setShareConfirmation] = useState(null);
    const [confirmShare, setConfirmShare] = useState(false);
    const fileInputRef = useRef(null);

    // ── Step 3: Order details ────────────────────────────────
    const [locationId, setLocationId] = useState('');
    const [deliveryMethod, setDeliveryMethod] = useState('pickup');
    const [specialInstructions, setSpecialInstructions] = useState('');
    const [notes, setNotes] = useState('');

    // Album details
    const [albumProduct, setAlbumProduct] = useState('');
    const [albumQuantity, setAlbumQuantity] = useState(1);
    const [albumPhotoSource, setAlbumPhotoSource] = useState('');
    const [albumNotes, setAlbumNotes] = useState('');

    // Frame details
    const [frameProduct, setFrameProduct] = useState('');
    const [frameQuantity, setFrameQuantity] = useState(1);
    const [framePhotoSource, setFramePhotoSource] = useState('');
    const [frameNotes, setFrameNotes] = useState('');

    // Mug details
    const [mugProduct, setMugProduct] = useState('');
    const [mugQuantity, setMugQuantity] = useState(1);
    const [mugPhotoSource, setMugPhotoSource] = useState('');
    const [mugNotes, setMugNotes] = useState('');

    // ── Step 4: Payment ──────────────────────────────────────
    const [collectPayment, setCollectPayment] = useState(false);
    const [paymentAmount, setPaymentAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [paymentReference, setPaymentReference] = useState('');

    // ── Submission ──────────────────────────────────────────
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    const dropdownRef = useRef(null);

    // Filter products by category
    const reprintProducts = products.filter(p => p.category === 'reprint');
    const albumProducts = products.filter(p => p.category === 'album');
    const frameProducts = products.filter(p => p.category === 'frame');
    const mugProducts = products.filter(p => p.category === 'mug');
    const selectedReprintProduct = reprintProducts.find(p => p.id == reprintProduct);
    const selectedAlbumProduct = albumProducts.find(p => p.id == albumProduct);
    const selectedFrameProduct = frameProducts.find(p => p.id == frameProduct);
    const selectedMugProduct = mugProducts.find(p => p.id == mugProduct);
    const reprintTotal = selectedReprintProduct ? parseFloat(selectedReprintProduct.price) * reprintQuantity : 0;
    const albumTotal = selectedAlbumProduct ? parseFloat(selectedAlbumProduct.price) * albumQuantity : 0;
    const frameTotal = selectedFrameProduct ? parseFloat(selectedFrameProduct.price) * frameQuantity : 0;
    const mugTotal = selectedMugProduct ? parseFloat(selectedMugProduct.price) * mugQuantity : 0;

    // Step completion checks
    const isStep1Complete = () => {
        if (customerType === 'existing' && selectedCustomer) return true;
        if (customerType === 'walkin' && customerName.trim() && customerPhone.trim()) return true;
        return false;
    };

    const isStep2Complete = () => {
        return selectedServices.size > 0;
    };

    const isStep3Complete = () => {
        if (selectedServices.has('reprint')) {
            if (!reprintProduct) return false;
            if (customerType === 'existing' && customerRegistries.length > 0 && reprintSource === 'registry' && !selectedRegistry) return false;
            if (customerType === 'existing' && customerRegistries.length === 0 && reprintSource === 'registry') return true; // No registries, skip validation
            if (reprintSource === 'manual' && manualPhotoId.trim() && !manualPhotoData) return false;
            if (reprintSource === 'upload' && !reprintFile) return false;
            if (reprintSource === 'awaiting') return true; // Valid - will upload later
        }
        if (selectedServices.has('album') && !albumProduct) return false;
        if (selectedServices.has('frame') && !frameProduct) return false;
        if (selectedServices.has('mug') && !mugProduct) return false;
        return true;
    };

    const isStep4Complete = () => {
        return deliveryMethod === 'pickup' ? !!locationId : true;
    };

    const canSubmit = () => {
        return isStep1Complete() && isStep2Complete() && isStep3Complete() && isStep4Complete();
    };

    // Fetch photo registries when customer is selected
    useEffect(() => {
        if (selectedCustomer && customerType === 'existing') {
            setLoadingRegistries(true);
            axios.get(route('staff.customers.photo-registries', selectedCustomer.id))
                .then(res => {
                    setCustomerRegistries(res.data);
                    if (res.data.length > 0) {
                        setReprintSource('registry');
                    } else {
                        setReprintSource('manual');
                    }
                })
                .catch(() => setCustomerRegistries([]))
                .finally(() => setLoadingRegistries(false));
        } else {
            setCustomerRegistries([]);
            if (customerType === 'walkin') {
                setReprintSource('manual');
            }
        }
    }, [selectedCustomer, customerType]);

    // Debounced customer search
    useEffect(() => {
        if (!searchQuery || searchQuery.length < 2) {
            setSearchResults([]);
            setShowDropdown(false);
            return;
        }
        const timer = setTimeout(async () => {
            setSearching(true);
            try {
                const res = await axios.get(route('staff.customers.search'), { params: { q: searchQuery } });
                setSearchResults(res.data);
                setShowDropdown(true);
            } catch {
            } finally {
                setSearching(false);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Close dropdown on outside click
    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    // Calculate total
    const calculateTotal = () => {
        let total = 0;
        if (selectedServices.has('reprint') && reprintProduct) {
            total += reprintTotal;
        }
        if (selectedServices.has('album') && albumProduct) {
            total += albumTotal;
        }
        if (selectedServices.has('frame') && frameProduct) {
            total += frameTotal;
        }
        if (selectedServices.has('mug') && mugProduct) {
            total += mugTotal;
        }
        return total;
    };

    // Customer actions
    const selectCustomer = (customer) => {
        setSelectedCustomer(customer);
        setSearchQuery(customer.name);
        setShowDropdown(false);
        setSelectedRegistry(null);
        setManualPhotoId('');
        setManualPhotoData(null);
    };

    const clearCustomer = () => {
        setSelectedCustomer(null);
        setSearchQuery('');
        setCustomerRegistries([]);
        setSelectedRegistry(null);
    };

    // Manual Photo ID lookup
    const handleManualPhotoIdLookup = async () => {
        if (!manualPhotoId.trim()) return;
        setManualPhotoLookingUp(true);
        setManualPhotoError('');
        setShareConfirmation(null);
        try {
            const { data } = await axios.post('/reprint/lookup', { code: manualPhotoId.trim() });
            if (data.found) {
                setManualPhotoData(data.registry);
                if (data.registry.existing_customer) {
                    const currentCustomerId = customerType === 'existing' && selectedCustomer ? selectedCustomer.id : null;
                    if (data.registry.existing_customer.id !== currentCustomerId) {
                        setShareConfirmation({
                            registryCode: data.registry.code,
                            existingCustomer: data.registry.existing_customer,
                        });
                    }
                }
            } else {
                setManualPhotoError(data.message || 'Photo ID not found.');
                setManualPhotoData(null);
            }
        } catch (err) {
            setManualPhotoError(err.response?.data?.message || 'Invalid FDCL Photo ID.');
            setManualPhotoData(null);
        } finally {
            setManualPhotoLookingUp(false);
        }
    };

    // File upload
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setReprintFile(file);
        const reader = new FileReader();
        reader.onload = (ev) => setReprintPreview(ev.target.result);
        reader.readAsDataURL(file);
    };

    const removeFile = () => {
        setReprintFile(null);
        setReprintPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    // Submit
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!canSubmit()) return;

        setSubmitting(true);
        setErrors({});

        const data = {
            location_id: locationId,
            delivery_method: deliveryMethod,
            special_instructions: specialInstructions,
            notes: notes,
            services: Array.from(selectedServices),
        };

        if (customerType === 'existing' && selectedCustomer) {
            data.customer_id = selectedCustomer.id;
        } else {
            data.customer_name = customerName;
            data.customer_phone = customerPhone;
            data.customer_email = customerEmail;
        }

        if (selectedServices.has('reprint')) {
            data.reprint = {
                source: reprintSource,
                product_id: parseInt(reprintProduct),
                quantity: reprintQuantity,
                paper_type: reprintPaperType,
                confirm_share: confirmShare,
            };

            if (reprintSource === 'registry' && selectedRegistry) {
                data.reprint.registry_code = selectedRegistry.code;
            } else if (reprintSource === 'manual') {
                data.reprint.photo_id = manualPhotoId.trim() || null;
                if (manualPhotoData) {
                    data.reprint.registry_code = manualPhotoData.code;
                }
            }
        }

        if (selectedServices.has('album')) {
            data.album = {
                product_id: parseInt(albumProduct),
                quantity: albumQuantity,
                photo_source: albumPhotoSource,
                notes: albumNotes,
            };
        }

        if (selectedServices.has('frame')) {
            data.frame = {
                product_id: parseInt(frameProduct),
                quantity: frameQuantity,
                photo_source: framePhotoSource,
                notes: frameNotes,
            };
        }

        if (selectedServices.has('mug')) {
            data.mug = {
                product_id: parseInt(mugProduct),
                quantity: mugQuantity,
                photo_source: mugPhotoSource,
                notes: mugNotes,
            };
        }

        if (collectPayment && parseFloat(paymentAmount) > 0) {
            data.payment_amount = parseFloat(paymentAmount);
            data.payment_method = paymentMethod;
            data.payment_reference = paymentReference;
        }

        if (reprintFile && selectedServices.has('reprint') && reprintSource === 'upload') {
            const formData = new FormData();
            Object.keys(data).forEach(key => {
                if (typeof data[key] === 'object' && data[key] !== null) {
                    formData.append(key, JSON.stringify(data[key]));
                } else {
                    formData.append(key, data[key]);
                }
            });
            formData.append('reprint_file', reprintFile);

            router.post(route('staff.orders.store'), formData, {
                forceFormData: true,
                onError: (errs) => {
                    setErrors(errs);
                    setSubmitting(false);
                    if (errs['reprint.registry_code'] || errs['reprint.photo_id']) {
                        if (shareConfirmation) {
                            setConfirmShare(false);
                        }
                    }
                },
                onFinish: () => setSubmitting(false),
            });
        } else {
            router.post(route('staff.orders.store'), data, {
                onError: (errs) => {
                    setErrors(errs);
                    setSubmitting(false);
                    if (errs['reprint.registry_code'] || errs['reprint.photo_id']) {
                        if (shareConfirmation) {
                            setConfirmShare(false);
                        }
                    }
                },
                onFinish: () => setSubmitting(false),
            });
        }
    };

    return (
        <StaffLayout>
            <Head title="Create Order" />

            {/* Page header */}
            <div className="mb-6 flex items-center gap-4">
                <Link
                    href="/staff"
                    className="rounded-lg p-2 text-muted-foreground hover:bg-muted transition-colors"
                >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                    </svg>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold">Create Order</h1>
                    <p className="text-sm text-muted-foreground">Create a new order for a customer</p>
                </div>
            </div>

            {/* Progress Steps */}
            <div className="mb-6 flex items-center gap-6 border-b pb-4">
                <StepHeader number={1} title="Customer" isComplete={isStep1Complete()} isActive={true} />
                <div className={`h-0.5 w-8 ${isStep1Complete() ? 'bg-primary' : 'bg-gray-200'}`} />
                <StepHeader number={2} title="Services" isComplete={isStep1Complete() && isStep2Complete()} isActive={isStep1Complete()} />
                <div className={`h-0.5 w-8 ${isStep1Complete() && isStep2Complete() && isStep3Complete() ? 'bg-primary' : 'bg-gray-200'}`} />
                <StepHeader number={3} title="Details" isComplete={isStep1Complete() && isStep2Complete() && isStep3Complete()} isActive={isStep1Complete() && isStep2Complete()} />
                <div className={`h-0.5 w-8 ${isStep1Complete() && isStep2Complete() && isStep3Complete() && isStep4Complete() ? 'bg-primary' : 'bg-gray-200'}`} />
                <StepHeader number={4} title="Review" isComplete={false} isActive={isStep1Complete() && isStep2Complete() && isStep3Complete() && isStep4Complete()} />
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">

                {/* ── STEP 1: Customer ────────────────────────────── */}
                <section className={`rounded-xl border bg-card p-6 ${!isStep1Complete() ? 'ring-1 ring-primary' : ''}`}>
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-lg font-semibold">1. Customer</h2>
                        {isStep1Complete() && (
                            <span className="flex items-center gap-1 text-sm text-primary">
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                                Complete
                            </span>
                        )}
                    </div>

                    {/* Customer type selection */}
                    <div className="mb-4">
                        <label className="mb-3 block text-sm font-medium text-gray-700">
                            Customer Type <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => {
                                    setCustomerType('existing');
                                    setSelectedCustomer(null);
                                    setSearchQuery('');
                                    setCustomerName('');
                                    setCustomerPhone('');
                                    setCustomerEmail('');
                                }}
                                className={`rounded-lg border p-4 text-left transition-all ${
                                    customerType === 'existing'
                                        ? 'border-primary bg-primary/5 ring-1 ring-primary'
                                        : 'border-gray-200 hover:border-gray-300'
                                }`}
                            >
                                <svg className={`h-6 w-6 ${customerType === 'existing' ? 'text-primary' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952A4.125 4.125 0 0 0 15.933 16m0 0v-.003m0 0a4.065 4.065 0 0 0-4.063-3h-.003a4.065 4.065 0 0 0-4.063 3M15 19.128v.003A4.125 4.125 0 0 1 8.25 22c-2.331 0-4.512-.645-6.374-1.766l-.001-.109A4.125 4.125 0 0 1 13.828 16M15 19.128a9.38 9.38 0 0 0 2.625.372M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM15.75 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Z" />
                                </svg>
                                <p className={`mt-2 text-sm font-medium ${customerType === 'existing' ? 'text-primary' : 'text-gray-900'}`}>
                                    Existing Customer
                                </p>
                                <p className="text-xs text-gray-500">Search by name or phone</p>
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setCustomerType('walkin');
                                    setSelectedCustomer(null);
                                    setSearchQuery('');
                                }}
                                className={`rounded-lg border p-4 text-left transition-all ${
                                    customerType === 'walkin'
                                        ? 'border-primary bg-primary/5 ring-1 ring-primary'
                                        : 'border-gray-200 hover:border-gray-300'
                                }`}
                            >
                                <svg className={`h-6 w-6 ${customerType === 'walkin' ? 'text-primary' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM4 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 10.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
                                </svg>
                                <p className={`mt-2 text-sm font-medium ${customerType === 'walkin' ? 'text-primary' : 'text-gray-900'}`}>
                                    Walk-in Customer
                                </p>
                                <p className="text-xs text-gray-500">New customer details</p>
                            </button>
                        </div>
                    </div>

                    {/* Existing customer search */}
                    {customerType === 'existing' && (
                        <div className="space-y-4">
                            {selectedCustomer ? (
                                <div className="flex items-center justify-between rounded-lg border bg-muted/30 p-4">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">{selectedCustomer.name}</span>
                                            {selectedCustomer.is_walk_in && (
                                                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                                                    Walk-in
                                                </span>
                                            )}
                                        </div>
                                        <div className="mt-0.5 text-sm text-muted-foreground">
                                            {selectedCustomer.phone}
                                            {selectedCustomer.email && !selectedCustomer.email.endsWith('@fdcl.local') && (
                                                <span> · {selectedCustomer.email}</span>
                                            )}
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={clearCustomer}
                                        className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted transition-colors"
                                    >
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            ) : (
                                <div className="relative" ref={dropdownRef}>
                                    <label className={LABEL}>Search customer</label>
                                    <div className="relative mt-1">
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Type name or phone number..."
                                            className={INPUT + ' pr-9'}
                                            autoComplete="off"
                                        />
                                        {searching && (
                                            <div className="absolute right-2.5 top-2.5">
                                                <svg className="h-4 w-4 animate-spin text-muted-foreground" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>

                                    {showDropdown && (
                                        <div className="absolute z-10 mt-1 w-full rounded-lg border bg-card shadow-lg">
                                            {searchResults.length > 0 ? (
                                                searchResults.map((customer) => (
                                                    <button
                                                        key={customer.id}
                                                        type="button"
                                                        onClick={() => selectCustomer(customer)}
                                                        className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-muted first:rounded-t-lg last:rounded-b-lg transition-colors"
                                                    >
                                                        <div>
                                                            <div className="flex items-center gap-2 text-sm font-medium">
                                                                {customer.name}
                                                                {customer.is_walk_in && (
                                                                    <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-xs text-amber-700">
                                                                        Walk-in
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="text-xs text-muted-foreground">{customer.phone}</div>
                                                        </div>
                                                        <svg className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6" />
                                                        </svg>
                                                    </button>
                                                ))
                                            ) : (
                                                <div className="px-4 py-3 text-sm text-muted-foreground">No customers found</div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Walk-in customer form */}
                    {customerType === 'walkin' && (
                        <div className="space-y-4 rounded-lg border bg-muted/20 p-4">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label className={LABEL}>
                                        Name <span className="text-destructive">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={customerName}
                                        onChange={(e) => setCustomerName(e.target.value)}
                                        placeholder="Full name"
                                        className={INPUT}
                                    />
                                    {errors.customer_name && <p className={ERR}>{errors.customer_name}</p>}
                                </div>
                                <div>
                                    <label className={LABEL}>
                                        Phone <span className="text-destructive">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={customerPhone}
                                        onChange={(e) => setCustomerPhone(e.target.value)}
                                        placeholder="01XXXXXXXXX"
                                        className={INPUT}
                                    />
                                    {errors.customer_phone && <p className={ERR}>{errors.customer_phone}</p>}
                                </div>
                                <div className="sm:col-span-2">
                                    <label className={LABEL}>
                                        Email <span className="text-xs font-normal text-muted-foreground">(optional)</span>
                                    </label>
                                    <input
                                        type="email"
                                        value={customerEmail}
                                        onChange={(e) => setCustomerEmail(e.target.value)}
                                        placeholder="customer@example.com"
                                        className={INPUT}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </section>

                {/* ── STEP 2: Services ──────────────────────────────── */}
                <section className={`rounded-xl border bg-card p-6 ${!isStep1Complete() ? 'pointer-events-none opacity-50' : ''} ${isStep1Complete() && !isStep2Complete() ? 'ring-1 ring-primary' : ''}`}>
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-lg font-semibold">2. Select Services</h2>
                        {isStep2Complete() && (
                            <span className="flex items-center gap-1 text-sm text-primary">
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                                Complete
                            </span>
                        )}
                    </div>

                    {isStep1Complete() && (
                        <>
                            <div className="mb-4 rounded-lg bg-muted/30 px-4 py-2 text-sm">
                                <span className="text-muted-foreground">Customer:</span>{' '}
                                <span className="font-medium">
                                    {customerType === 'existing' && selectedCustomer
                                        ? selectedCustomer.name
                                        : customerType === 'walkin'
                                            ? customerName || 'New customer'
                                            : 'Not selected'}
                                </span>
                            </div>

                            <p className="mb-4 text-sm text-muted-foreground">
                                Select one or more services for this order.
                            </p>

                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                                {SERVICES.map((service) => {
                                    const isSelected = selectedServices.has(service.id);
                                    return (
                                        <button
                                            key={service.id}
                                            type="button"
                                            onClick={() => {
                                                const newSet = new Set(selectedServices);
                                                if (newSet.has(service.id)) {
                                                    newSet.delete(service.id);
                                                } else {
                                                    newSet.add(service.id);
                                                }
                                                setSelectedServices(newSet);
                                            }}
                                            className={`rounded-lg border p-4 text-left transition-all ${
                                                isSelected
                                                    ? 'border-primary bg-primary/5 ring-1 ring-primary'
                                                    : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                                            }`}
                                        >
                                            <div className="flex items-start justify-between gap-2">
                                                <ServiceIcon type={service.icon} className={`h-6 w-6 ${isSelected ? 'text-primary' : 'text-gray-400'}`} />
                                                <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                                                    isSelected
                                                        ? 'border-primary bg-primary text-white'
                                                        : 'border-gray-300 bg-white'
                                                }`}>
                                                    {isSelected && (
                                                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    )}
                                                </div>
                                            </div>
                                            <p className={`mt-2 text-sm font-medium ${isSelected ? 'text-primary' : 'text-gray-900'}`}>
                                                {service.name}
                                            </p>
                                            <p className="mt-1 text-xs text-gray-500 line-clamp-2">
                                                {service.description}
                                            </p>
                                        </button>
                                    );
                                })}
                            </div>

                            {errors.services && <p className={ERR}>{errors.services}</p>}
                        </>
                    )}
                </section>

                {/* ── STEP 3: Details ──────────────────────────────── */}
                <section className={`rounded-xl border bg-card p-6 ${!isStep1Complete() || !isStep2Complete() ? 'pointer-events-none opacity-50' : ''} ${isStep1Complete() && isStep2Complete() && !isStep3Complete() ? 'ring-1 ring-primary' : ''}`}>
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-lg font-semibold">3. Order Details</h2>
                        {isStep3Complete() && isStep4Complete() && (
                            <span className="flex items-center gap-1 text-sm text-primary">
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                                Complete
                            </span>
                        )}
                    </div>

                    {isStep1Complete() && isStep2Complete() && (
                        <>
                            {/* Reprint Details */}
                            {selectedServices.has('reprint') && (
                                <div className="mb-6">
                                    <h3 className="mb-3 text-sm font-semibold text-gray-900">Print Details</h3>

                                    {/* Customer photo registries (existing customer only) */}
                                    {customerType === 'existing' && customerRegistries.length > 0 && (
                                        <div className="mb-4">
                                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                                Customer Photos <span className="text-red-500">*</span>
                                            </label>
                                            <p className="mb-3 text-xs text-gray-500">
                                                Select from this customer's previous photos, or use the options below.
                                            </p>

                                            {loadingRegistries ? (
                                                <div className="flex items-center justify-center py-8">
                                                    <svg className="h-6 w-6 animate-spin text-gray-400" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                    </svg>
                                                </div>
                                            ) : (
                                                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                                                    {customerRegistries.map((registry) => {
                                                        const isSelected = selectedRegistry?.id === registry.id && reprintSource === 'registry';
                                                        return (
                                                            <button
                                                                key={registry.id}
                                                                type="button"
                                                                onClick={() => {
                                                                    setSelectedRegistry(registry);
                                                                    setReprintSource('registry');
                                                                    setManualPhotoId('');
                                                                    setManualPhotoData(null);
                                                                    removeFile();
                                                                }}
                                                                className={`rounded-lg border p-3 text-left transition-all ${
                                                                    isSelected
                                                                        ? 'border-primary bg-primary/5 ring-1 ring-primary'
                                                                        : 'border-gray-200 bg-white hover:border-gray-300'
                                                                }`}
                                                            >
                                                                {registry.photos && registry.photos.length > 0 && (
                                                                    <div className="mb-2 aspect-square overflow-hidden rounded border bg-gray-100">
                                                                        <img
                                                                            src={`/storage/${registry.photos[0]}`}
                                                                            alt=""
                                                                            className="h-full w-full object-cover"
                                                                        />
                                                                    </div>
                                                                )}
                                                                <p className={`truncate text-sm font-medium ${isSelected ? 'text-primary' : 'text-gray-900'}`}>
                                                                    {registry.code}
                                                                </p>
                                                                <p className="text-xs text-gray-500">{registry.created_at}</p>
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Source selection */}
                                    <div className="mb-4">
                                        <label className="mb-2 block text-sm font-medium text-gray-700">
                                            {customerType === 'existing' && customerRegistries.length > 0
                                                ? 'Or use alternative source'
                                                : 'Photo Source'}
                                        </label>

                                        <div className="flex flex-col gap-3">
                                            {/* Manual Photo ID entry */}
                                            <div className={`rounded-lg border p-4 ${reprintSource === 'manual' ? 'border-primary bg-primary/5' : 'border-gray-200'}`}>
                                                <div className="flex items-start gap-3">
                                                    <input
                                                        type="radio"
                                                        name="reprintSource"
                                                        checked={reprintSource === 'manual'}
                                                        onChange={() => {
                                                            setReprintSource('manual');
                                                            setSelectedRegistry(null);
                                                            removeFile();
                                                        }}
                                                        className="mt-1 h-4 w-4 text-primary"
                                                    />
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium text-gray-700">
                                                            {customerType === 'walkin' ? 'Enter Photo ID (optional)' : 'Enter Photo ID manually'}
                                                        </p>
                                                        {customerType === 'walkin' && (
                                                            <p className="text-xs text-gray-500">
                                                                Leave blank if this is a new photo session. System will generate a Photo ID.
                                                            </p>
                                                        )}
                                                        {reprintSource === 'manual' && (
                                                            <div className="mt-3">
                                                                <div className="flex gap-2">
<input
                                                                            type="text"
                                                                            value={manualPhotoId}
                                                                            onChange={(e) => {
                                                                                setManualPhotoId(e.target.value.toUpperCase());
                                                                                setManualPhotoData(null);
                                                                                setManualPhotoError('');
                                                                                setShareConfirmation(null);
                                                                                setConfirmShare(false);
                                                                            }}
                                                                            placeholder="e.g. FDL-2024-001"
                                                                            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm font-mono uppercase placeholder:normal-case placeholder:font-sans focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                                                        />
                                                                    <button
                                                                        type="button"
                                                                        onClick={handleManualPhotoIdLookup}
                                                                        disabled={manualPhotoLookingUp || !manualPhotoId.trim()}
                                                                        className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 disabled:opacity-50"
                                                                    >
                                                                        {manualPhotoLookingUp ? '...' : 'Verify'}
                                                                    </button>
                                                                </div>
                                                                {manualPhotoError && (
                                                                    <p className="mt-2 text-sm text-red-600">{manualPhotoError}</p>
                                                                )}
                                                                {manualPhotoData && (
                                                                    <div className="mt-3 rounded-lg border border-green-200 bg-green-50 p-3">
                                                                        <div className="flex items-center gap-2 text-sm font-medium text-green-700">
                                                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                                                            </svg>
                                                                            Photo found: {manualPhotoData.code}
                                                                        </div>
                                                                        {manualPhotoData.photos && manualPhotoData.photos.length > 0 && (
                                                                            <div className="mt-2 flex gap-2">
                                                                                {manualPhotoData.photos.slice(0, 3).map((photo, i) => (
                                                                                    <div
                                                                                        key={i}
                                                                                        className="h-16 w-16 rounded border border-green-200 bg-white bg-cover bg-center"
                                                                                        style={{ backgroundImage: `url(/storage/${photo})` }}
                                                                                    />
                                                                                ))}
                                                                            </div>
                                                                        )}
                                                                        {manualPhotoData.existing_customer && (
                                                                            <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3">
                                                                                <p className="text-sm font-medium text-amber-800">
                                                                                    This Photo ID is already associated with:
                                                                                </p>
                                                                                <p className="mt-1 text-sm text-amber-900">
                                                                                    {manualPhotoData.existing_customer.name}
                                                                                    {manualPhotoData.existing_customer.phone && (
                                                                                        <span className="text-amber-700"> ({manualPhotoData.existing_customer.phone})</span>
                                                                                    )}
                                                                                </p>
                                                                                {!confirmShare ? (
                                                                                    <button
                                                                                        type="button"
                                                                                        onClick={() => setConfirmShare(true)}
                                                                                        className="mt-2 rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-amber-700"
                                                                                    >
                                                                                        Use for this order too
                                                                                    </button>
                                                                                ) : (
                                                                                    <p className="mt-2 flex items-center gap-1 text-xs font-medium text-green-700">
                                                                                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                                                        </svg>
                                                                                        Will be shared with this customer
                                                                                    </p>
                                                                                )}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Upload option */}
                                            <div className={`rounded-lg border p-4 ${reprintSource === 'upload' ? 'border-primary bg-primary/5' : 'border-gray-200'}`}>
                                                <div className="flex items-start gap-3">
                                                    <input
                                                        type="radio"
                                                        name="reprintSource"
                                                        checked={reprintSource === 'upload'}
                                                        onChange={() => {
                                                            setReprintSource('upload');
                                                            setSelectedRegistry(null);
                                                            setManualPhotoId('');
                                                            setManualPhotoData(null);
                                                        }}
                                                        className="mt-1 h-4 w-4 text-primary"
                                                    />
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium text-gray-700">Upload photo</p>
                                                        <p className="text-xs text-gray-500">Upload a photo from your device</p>
                                                        {reprintSource === 'upload' && (
                                                            <div className="mt-3">
                                                                {!reprintFile ? (
                                                                    <label className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-6 transition-colors hover:border-primary/50 hover:bg-primary/5">
                                                                        <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
                                                                        </svg>
                                                                        <span className="text-sm font-medium text-primary">Click to upload</span>
                                                                        <input
                                                                            ref={fileInputRef}
                                                                            type="file"
                                                                            accept="image/jpeg,image/png,image/jpg"
                                                                            onChange={handleFileChange}
                                                                            className="hidden"
                                                                        />
                                                                    </label>
                                                                ) : (
                                                                    <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-3">
                                                                        {reprintPreview && (
                                                                            <img
                                                                                src={reprintPreview}
                                                                                alt="Preview"
                                                                                className="h-12 w-12 rounded border border-green-200 object-cover"
                                                                            />
                                                                        )}
                                                                        <div className="min-w-0 flex-1">
                                                                            <p className="truncate text-sm font-medium text-green-700">{reprintFile.name}</p>
                                                                            <p className="text-xs text-green-600">{(reprintFile.size / 1024 / 1024).toFixed(1)} MB</p>
                                                                        </div>
                                                                        <button
                                                                            type="button"
                                                                            onClick={removeFile}
                                                                            className="rounded p-1 text-green-600 hover:bg-green-100"
                                                                        >
                                                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                                                            </svg>
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* New Photo Session / Awaiting Photo option */}
                                            <div className={`rounded-lg border p-4 ${reprintSource === 'awaiting' ? 'border-primary bg-primary/5' : 'border-gray-200'}`}>
                                                <div className="flex items-start gap-3">
                                                    <input
                                                        type="radio"
                                                        name="reprintSource"
                                                        checked={reprintSource === 'awaiting'}
                                                        onChange={() => {
                                                            setReprintSource('awaiting');
                                                            setSelectedRegistry(null);
                                                            setManualPhotoId('');
                                                            setManualPhotoData(null);
                                                            removeFile();
                                                        }}
                                                        className="mt-1 h-4 w-4 text-primary"
                                                    />
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium text-gray-700">New Photo Session</p>
                                                        <p className="text-xs text-gray-500">
                                                            Customer is here for a new photo. Leave blank and upload later.
                                                        </p>
                                                        {reprintSource === 'awaiting' && (
                                                            <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3">
                                                                <div className="flex items-center gap-2 text-sm text-amber-700">
                                                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                                                                    </svg>
                                                                    <span className="font-medium">Awaiting Photo</span>
                                                                </div>
                                                                <p className="mt-1 text-xs text-amber-600">
                                                                    Photo ID will be generated when you upload the photo.
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {errors.reprint_source && <p className={ERR}>{errors.reprint_source}</p>}
                                    </div>

                                    {/* Photo size */}
                                    <div className="mb-4">
                                        <label className="mb-2 block text-sm font-medium text-gray-700">
                                            Photo size <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={reprintProduct}
                                            onChange={(e) => setReprintProduct(e.target.value)}
                                            className={INPUT}
                                        >
                                            <option value="">Select size...</option>
                                            {reprintProducts.map((product) => (
                                                <option key={product.id} value={product.id}>
                                                    {product.name} ({product.size_label}) — ৳{parseFloat(product.price).toFixed(0)}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.reprint_product && <p className={ERR}>{errors.reprint_product}</p>}
                                    </div>

                                    {/* Number of copies */}
                                    <div className="mb-4">
                                        <label className="mb-2 block text-sm font-medium text-gray-700">
                                            Number of copies <span className="text-red-500">*</span>
                                        </label>
                                        <div className="flex items-center gap-3">
                                            <button
                                                type="button"
                                                onClick={() => setReprintQuantity(Math.max(1, reprintQuantity - 1))}
                                                className="rounded-lg border border-gray-300 px-3 py-2 text-gray-500 transition-colors hover:bg-gray-50"
                                            >
                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
                                                </svg>
                                            </button>
                                            <input
                                                type="number"
                                                min="1"
                                                max="100"
                                                value={reprintQuantity}
                                                onChange={(e) => setReprintQuantity(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
                                                className="w-20 rounded-lg border border-gray-300 px-4 py-2 text-center text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setReprintQuantity(Math.min(100, reprintQuantity + 1))}
                                                className="rounded-lg border border-gray-300 px-3 py-2 text-gray-500 transition-colors hover:bg-gray-50"
                                            >
                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Paper type */}
                                    <div className="mb-4">
                                        <label className="mb-2 block text-sm font-medium text-gray-700">
                                            Paper type
                                        </label>
                                        <select
                                            value={reprintPaperType}
                                            onChange={(e) => setReprintPaperType(e.target.value)}
                                            className={INPUT}
                                        >
                                            <option value="glossy">Glossy</option>
                                            <option value="matte">Matte</option>
                                        </select>
                                    </div>

                                    {/* Total */}
                                    {reprintProduct && (
                                        <div className="rounded-lg bg-gray-50 p-4">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-600">Reprint subtotal</span>
                                                <span className="text-xl font-bold text-gray-900">৳{reprintTotal.toFixed(0)}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Album Details */}
                            {selectedServices.has('album') && (
                                <div className="mb-6">
                                    <h3 className="mb-3 text-sm font-semibold text-gray-900">Album Details</h3>

                                    {/* Album products grid */}
                                    <div className="mb-4">
                                        <label className="mb-2 block text-sm font-medium text-gray-700">
                                            Select Album <span className="text-red-500">*</span>
                                        </label>
                                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                                            {albumProducts.map((product) => {
                                                const isSelected = albumProduct === product.id.toString();
                                                return (
                                                    <button
                                                        key={product.id}
                                                        type="button"
                                                        onClick={() => setAlbumProduct(product.id.toString())}
                                                        className={`rounded-lg border p-3 text-left transition-all ${
                                                            isSelected
                                                                ? 'border-primary bg-primary/5 ring-1 ring-primary'
                                                                : 'border-gray-200 bg-white hover:border-gray-300'
                                                        }`}
                                                    >
                                                        <p className={`text-sm font-medium ${isSelected ? 'text-primary' : 'text-gray-900'}`}>
                                                            {product.name}
                                                        </p>
                                                        <p className="text-xs text-gray-500">{product.size_label}</p>
                                                        <p className="mt-1 text-sm font-semibold text-gray-900">৳{parseFloat(product.price).toFixed(0)}</p>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                        {errors.album_product && <p className={ERR}>{errors.album_product}</p>}
                                    </div>

                                    {/* Quantity */}
                                    <div className="mb-4">
                                        <label className="mb-2 block text-sm font-medium text-gray-700">
                                            Quantity <span className="text-red-500">*</span>
                                        </label>
                                        <div className="flex items-center gap-3">
                                            <button
                                                type="button"
                                                onClick={() => setAlbumQuantity(Math.max(1, albumQuantity - 1))}
                                                className="rounded-lg border border-gray-300 px-3 py-2 text-gray-500 transition-colors hover:bg-gray-50"
                                            >
                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
                                                </svg>
                                            </button>
                                            <input
                                                type="number"
                                                min="1"
                                                max="100"
                                                value={albumQuantity}
                                                onChange={(e) => setAlbumQuantity(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
                                                className="w-20 rounded-lg border border-gray-300 px-4 py-2 text-center text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setAlbumQuantity(Math.min(100, albumQuantity + 1))}
                                                className="rounded-lg border border-gray-300 px-3 py-2 text-gray-500 transition-colors hover:bg-gray-50"
                                            >
                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Photo Source */}
                                    <div className="mb-4">
                                        <label className="mb-2 block text-sm font-medium text-gray-700">
                                            Photo Source
                                        </label>
                                        <textarea
                                            value={albumPhotoSource}
                                            onChange={(e) => setAlbumPhotoSource(e.target.value)}
                                            placeholder="Google Drive link, USB/Pendrive, WeTransfer, etc."
                                            rows={3}
                                            className={INPUT}
                                        />
                                        <p className="mt-1 text-xs text-gray-500">
                                            Provide link or describe how customer will provide photos.
                                        </p>
                                    </div>

                                    {/* Album Notes */}
                                    <div className="mb-4">
                                        <label className="mb-2 block text-sm font-medium text-gray-700">
                                            Notes for Album
                                        </label>
                                        <textarea
                                            value={albumNotes}
                                            onChange={(e) => setAlbumNotes(e.target.value)}
                                            placeholder="Any special instructions for album design..."
                                            rows={2}
                                            className={INPUT}
                                        />
                                    </div>

                                    {/* Total */}
                                    {albumProduct && (
                                        <div className="rounded-lg bg-gray-50 p-4">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-600">Album subtotal</span>
                                                <span className="text-xl font-bold text-gray-900">৳{albumTotal.toFixed(0)}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Frame Details */}
                            {selectedServices.has('frame') && (
                                <div className="mb-6">
                                    <h3 className="mb-3 text-sm font-semibold text-gray-900">Frame Details</h3>

                                    {/* Frame products grid */}
                                    <div className="mb-4">
                                        <label className="mb-2 block text-sm font-medium text-gray-700">
                                            Select Frame <span className="text-red-500">*</span>
                                        </label>
                                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                                            {frameProducts.map((product) => {
                                                const isSelected = frameProduct === product.id.toString();
                                                return (
                                                    <button
                                                        key={product.id}
                                                        type="button"
                                                        onClick={() => setFrameProduct(product.id.toString())}
                                                        className={`rounded-lg border p-3 text-left transition-all ${
                                                            isSelected
                                                                ? 'border-primary bg-primary/5 ring-1 ring-primary'
                                                                : 'border-gray-200 bg-white hover:border-gray-300'
                                                        }`}
                                                    >
                                                        <p className={`text-sm font-medium ${isSelected ? 'text-primary' : 'text-gray-900'}`}>
                                                            {product.name}
                                                        </p>
                                                        <p className="text-xs text-gray-500">{product.size_label}</p>
                                                        <p className="mt-1 text-sm font-semibold text-gray-900">৳{parseFloat(product.price).toFixed(0)}</p>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                        {errors.frame_product && <p className={ERR}>{errors.frame_product}</p>}
                                    </div>

                                    {/* Quantity */}
                                    <div className="mb-4">
                                        <label className="mb-2 block text-sm font-medium text-gray-700">
                                            Quantity <span className="text-red-500">*</span>
                                        </label>
                                        <div className="flex items-center gap-3">
                                            <button
                                                type="button"
                                                onClick={() => setFrameQuantity(Math.max(1, frameQuantity - 1))}
                                                className="rounded-lg border border-gray-300 px-3 py-2 text-gray-500 transition-colors hover:bg-gray-50"
                                            >
                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
                                                </svg>
                                            </button>
                                            <input
                                                type="number"
                                                min="1"
                                                max="100"
                                                value={frameQuantity}
                                                onChange={(e) => setFrameQuantity(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
                                                className="w-20 rounded-lg border border-gray-300 px-4 py-2 text-center text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setFrameQuantity(Math.min(100, frameQuantity + 1))}
                                                className="rounded-lg border border-gray-300 px-3 py-2 text-gray-500 transition-colors hover:bg-gray-50"
                                            >
                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Photo Source */}
                                    <div className="mb-4">
                                        <label className="mb-2 block text-sm font-medium text-gray-700">
                                            Photo Source
                                        </label>
                                        <textarea
                                            value={framePhotoSource}
                                            onChange={(e) => setFramePhotoSource(e.target.value)}
                                            placeholder="Google Drive link, USB/Pendrive, WeTransfer, etc."
                                            rows={3}
                                            className={INPUT}
                                        />
                                        <p className="mt-1 text-xs text-gray-500">
                                            Provide link or describe how customer will provide photos.
                                        </p>
                                    </div>

                                    {/* Frame Notes */}
                                    <div className="mb-4">
                                        <label className="mb-2 block text-sm font-medium text-gray-700">
                                            Notes for Frame
                                        </label>
                                        <textarea
                                            value={frameNotes}
                                            onChange={(e) => setFrameNotes(e.target.value)}
                                            placeholder="Any special instructions for frame..."
                                            rows={2}
                                            className={INPUT}
                                        />
                                    </div>

                                    {/* Total */}
                                    {frameProduct && (
                                        <div className="rounded-lg bg-gray-50 p-4">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-600">Frame subtotal</span>
                                                <span className="text-xl font-bold text-gray-900">৳{frameTotal.toFixed(0)}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Mug Details */}
                            {selectedServices.has('mug') && (
                                <div className="mb-6">
                                    <h3 className="mb-3 text-sm font-semibold text-gray-900">Mug Details</h3>

                                    {/* Mug products grid */}
                                    <div className="mb-4">
                                        <label className="mb-2 block text-sm font-medium text-gray-700">
                                            Select Mug <span className="text-red-500">*</span>
                                        </label>
                                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                                            {mugProducts.map((product) => {
                                                const isSelected = mugProduct === product.id.toString();
                                                return (
                                                    <button
                                                        key={product.id}
                                                        type="button"
                                                        onClick={() => setMugProduct(product.id.toString())}
                                                        className={`rounded-lg border p-3 text-left transition-all ${
                                                            isSelected
                                                                ? 'border-primary bg-primary/5 ring-1 ring-primary'
                                                                : 'border-gray-200 bg-white hover:border-gray-300'
                                                        }`}
                                                    >
                                                        <p className={`text-sm font-medium ${isSelected ? 'text-primary' : 'text-gray-900'}`}>
                                                            {product.name}
                                                        </p>
                                                        <p className="text-xs text-gray-500">{product.size_label}</p>
                                                        <p className="mt-1 text-sm font-semibold text-gray-900">৳{parseFloat(product.price).toFixed(0)}</p>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                        {errors.mug_product && <p className={ERR}>{errors.mug_product}</p>}
                                    </div>

                                    {/* Quantity */}
                                    <div className="mb-4">
                                        <label className="mb-2 block text-sm font-medium text-gray-700">
                                            Quantity <span className="text-red-500">*</span>
                                        </label>
                                        <div className="flex items-center gap-3">
                                            <button
                                                type="button"
                                                onClick={() => setMugQuantity(Math.max(1, mugQuantity - 1))}
                                                className="rounded-lg border border-gray-300 px-3 py-2 text-gray-500 transition-colors hover:bg-gray-50"
                                            >
                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
                                                </svg>
                                            </button>
                                            <input
                                                type="number"
                                                min="1"
                                                max="100"
                                                value={mugQuantity}
                                                onChange={(e) => setMugQuantity(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
                                                className="w-20 rounded-lg border border-gray-300 px-4 py-2 text-center text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setMugQuantity(Math.min(100, mugQuantity + 1))}
                                                className="rounded-lg border border-gray-300 px-3 py-2 text-gray-500 transition-colors hover:bg-gray-50"
                                            >
                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Photo Source */}
                                    <div className="mb-4">
                                        <label className="mb-2 block text-sm font-medium text-gray-700">
                                            Photo Source
                                        </label>
                                        <textarea
                                            value={mugPhotoSource}
                                            onChange={(e) => setMugPhotoSource(e.target.value)}
                                            placeholder="Google Drive link, USB/Pendrive, WeTransfer, etc."
                                            rows={3}
                                            className={INPUT}
                                        />
                                        <p className="mt-1 text-xs text-gray-500">
                                            Provide link or describe how customer will provide photos.
                                        </p>
                                    </div>

                                    {/* Mug Notes */}
                                    <div className="mb-4">
                                        <label className="mb-2 block text-sm font-medium text-gray-700">
                                            Notes for Mug
                                        </label>
                                        <textarea
                                            value={mugNotes}
                                            onChange={(e) => setMugNotes(e.target.value)}
                                            placeholder="Any special instructions for mug..."
                                            rows={2}
                                            className={INPUT}
                                        />
                                    </div>

                                    {/* Total */}
                                    {mugProduct && (
                                        <div className="rounded-lg bg-gray-50 p-4">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-600">Mug subtotal</span>
                                                <span className="text-xl font-bold text-gray-900">৳{mugTotal.toFixed(0)}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Order Details */}
                            <div>
                                <h3 className="mb-3 text-sm font-semibold text-gray-900">Delivery & Instructions</h3>

                                {/* Delivery method */}
                                <div className="mb-4">
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Delivery method <span className="text-red-500">*</span>
                                    </label>
                                    <div className="flex flex-col gap-2">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="deliveryMethod"
                                                value="pickup"
                                                checked={deliveryMethod === 'pickup'}
                                                onChange={() => setDeliveryMethod('pickup')}
                                                className="h-4 w-4 text-primary focus:ring-primary"
                                            />
                                            <span className="text-sm text-gray-700">Pickup from studio</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-not-allowed opacity-50">
                                            <input
                                                type="radio"
                                                name="deliveryMethod"
                                                value="home"
                                                disabled
                                                className="h-4 w-4 text-primary focus:ring-primary"
                                            />
                                            <span className="text-sm text-gray-500">Home delivery</span>
                                            <span className="text-xs text-gray-400">(Coming soon)</span>
                                        </label>
                                    </div>
                                </div>

                                {/* Pickup location */}
                                {deliveryMethod === 'pickup' && (
                                    <div className="mb-4">
                                        <label className={LABEL}>
                                            Pickup studio <span className="text-destructive">*</span>
                                        </label>
                                        <select
                                            value={locationId}
                                            onChange={(e) => setLocationId(e.target.value)}
                                            className={INPUT}
                                        >
                                            <option value="">Select location...</option>
                                            {locations.map((loc) => (
                                                <option key={loc.id} value={loc.id}>
                                                    {loc.name} — {loc.address}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.location_id && <p className={ERR}>{errors.location_id}</p>}
                                    </div>
                                )}

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div className="sm:col-span-2">
                                        <label className={LABEL}>
                                            Special Instructions{' '}
                                            <span className="text-xs font-normal text-muted-foreground">(optional)</span>
                                        </label>
                                        <textarea
                                            rows={2}
                                            value={specialInstructions}
                                            onChange={(e) => setSpecialInstructions(e.target.value)}
                                            placeholder="e.g. Matte paper, do not crop, specific colour notes..."
                                            className={INPUT + ' resize-none'}
                                        />
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label className={LABEL}>
                                            Staff Notes{' '}
                                            <span className="text-xs font-normal text-muted-foreground">
                                                (internal — not visible to customer)
                                            </span>
                                        </label>
                                        <textarea
                                            rows={2}
                                            value={notes}
                                            onChange={(e) => setNotes(e.target.value)}
                                            placeholder="Internal notes for staff..."
                                            className={INPUT + ' resize-none'}
                                        />
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </section>

                {/* ── STEP 4: Review & Payment ──────────────────────────── */}
                <section className={`rounded-xl border bg-card p-6 ${!isStep1Complete() || !isStep2Complete() || !isStep3Complete() ? 'pointer-events-none opacity-50' : ''}`}>
                    <h2 className="mb-4 text-lg font-semibold">4. Review & Submit</h2>

                    {isStep1Complete() && isStep2Complete() && isStep3Complete() && (
                        <>
                            {/* Order Summary */}
                            <div className="mb-6 rounded-lg bg-muted/30 p-4">
                                <h3 className="mb-3 text-sm font-semibold text-gray-700">Order Summary</h3>

                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Customer:</span>
                                        <span className="font-medium">
                                            {customerType === 'existing' && selectedCustomer
                                                ? selectedCustomer.name
                                                : customerType === 'walkin'
                                                    ? customerName
                                                    : 'Not selected'}
                                            <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs">
                                                {customerType === 'existing' ? 'Existing' : 'Walk-in'}
                                            </span>
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Services:</span>
                                        <span className="font-medium">
                                            {Array.from(selectedServices).map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(', ')}
                                        </span>
                                    </div>

                                    {selectedServices.has('reprint') && reprintProduct && (
                                        <div className="border-t pt-3">
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Reprint:</span>
                                                <span className="font-medium">
                                                    {selectedReprintProduct?.name} ({selectedReprintProduct?.size_label}) × {reprintQuantity}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Source:</span>
                                                <span>
                                                    {reprintSource === 'registry' && selectedRegistry
                                                        ? selectedRegistry.code
                                                        : reprintSource === 'manual' && manualPhotoData
                                                            ? manualPhotoData.code
                                                            : reprintSource === 'manual' && manualPhotoId
                                                                ? manualPhotoId
                                                                : reprintSource === 'manual'
                                                                    ? 'Awaiting Photo'
                                                                    : reprintSource === 'awaiting'
                                                                        ? 'Awaiting Photo'
                                                                        : 'Uploaded photo'}
                                                </span>
                                            </div>
                                            {reprintProduct && (
                                                <div className="mt-2 flex justify-between border-t pt-2">
                                                    <span className="font-medium">Reprint Total:</span>
                                                    <span className="font-bold">৳{reprintTotal.toFixed(0)}</span>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {selectedServices.has('album') && albumProduct && (
                                        <div className="border-t pt-3">
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Album:</span>
                                                <span className="font-medium">
                                                    {selectedAlbumProduct?.name} × {albumQuantity}
                                                </span>
                                            </div>
                                            {albumPhotoSource && (
                                                <div className="flex justify-between text-xs text-gray-400">
                                                    <span>Photo Source:</span>
                                                    <span className="max-w-[200px] truncate">{albumPhotoSource}</span>
                                                </div>
                                            )}
                                            <div className="mt-2 flex justify-between border-t pt-2">
                                                <span className="font-medium">Album Total:</span>
                                                <span className="font-bold">৳{albumTotal.toFixed(0)}</span>
                                            </div>
                                        </div>
                                    )}

                                    {selectedServices.has('frame') && frameProduct && (
                                        <div className="border-t pt-3">
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Frame:</span>
                                                <span className="font-medium">
                                                    {selectedFrameProduct?.name} × {frameQuantity}
                                                </span>
                                            </div>
                                            {framePhotoSource && (
                                                <div className="flex justify-between text-xs text-gray-400">
                                                    <span>Photo Source:</span>
                                                    <span className="max-w-[200px] truncate">{framePhotoSource}</span>
                                                </div>
                                            )}
                                            <div className="mt-2 flex justify-between border-t pt-2">
                                                <span className="font-medium">Frame Total:</span>
                                                <span className="font-bold">৳{frameTotal.toFixed(0)}</span>
                                            </div>
                                        </div>
                                    )}

                                    {selectedServices.has('mug') && mugProduct && (
                                        <div className="border-t pt-3">
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Mug:</span>
                                                <span className="font-medium">
                                                    {selectedMugProduct?.name} × {mugQuantity}
                                                </span>
                                            </div>
                                            {mugPhotoSource && (
                                                <div className="flex justify-between text-xs text-gray-400">
                                                    <span>Photo Source:</span>
                                                    <span className="max-w-[200px] truncate">{mugPhotoSource}</span>
                                                </div>
                                            )}
                                            <div className="mt-2 flex justify-between border-t pt-2">
                                                <span className="font-medium">Mug Total:</span>
                                                <span className="font-bold">৳{mugTotal.toFixed(0)}</span>
                                            </div>
                                        </div>
                                    )}

                                    <div className="border-t pt-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Delivery:</span>
                                            <span>Pickup from studio</span>
                                        </div>
                                        {locationId && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Location:</span>
                                                <span>{locations.find(l => l.id == locationId)?.name}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Payment */}
                            <div className="mb-6">
                                <label className="flex cursor-pointer items-center gap-3">
                                    <input
                                        type="checkbox"
                                        checked={collectPayment}
                                        onChange={(e) => {
                                            setCollectPayment(e.target.checked);
                                            if (e.target.checked) setPaymentAmount(calculateTotal().toFixed(2));
                                        }}
                                        className="h-4 w-4 rounded border-input text-primary"
                                    />
                                    <span className="text-sm font-medium">Collect payment now</span>
                                </label>

                                {collectPayment && (
                                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                                        <div>
                                            <label className={LABEL}>
                                                Amount (৳) <span className="text-destructive">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0.01"
                                                value={paymentAmount}
                                                onChange={(e) => setPaymentAmount(e.target.value)}
                                                className={INPUT}
                                            />
                                            {selectedServices.has('album') && (
                                                <p className="mt-1 text-xs text-muted-foreground">Amount can be adjusted for negotiation</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className={LABEL}>
                                                Method <span className="text-destructive">*</span>
                                            </label>
                                            <select
                                                value={paymentMethod}
                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                                className={INPUT}
                                            >
                                                {['cash', 'bkash', 'nagad', 'card', 'other'].map((m) => (
                                                    <option key={m} value={m}>
                                                        {m.charAt(0).toUpperCase() + m.slice(1)}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {['bkash', 'nagad', 'card'].includes(paymentMethod) && (
                                            <div>
                                                <label className={LABEL}>Transaction ID</label>
                                                <input
                                                    type="text"
                                                    value={paymentReference}
                                                    onChange={(e) => setPaymentReference(e.target.value)}
                                                    placeholder="TXN reference"
                                                    className={INPUT}
                                                />
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Submit */}
                            <div className="flex justify-end gap-3">
                                <Link
                                    href="/staff"
                                    className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={submitting || !canSubmit()}
                                    className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {submitting ? (
                                        <>
                                            <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                            </svg>
                                            Creating...
                                        </>
                                    ) : (
                                        <>
                                            Create Order
                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </>
                                    )}
                                </button>
                            </div>
                        </>
                    )}
                </section>

            </form>

            {/* Share Confirmation Modal */}
            {shareConfirmation && !confirmShare && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="mx-4 w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
                        <div className="mb-4 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
                                <svg className="h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Share Photo ID?</h3>
                                <p className="text-sm text-gray-500">This Photo ID is already used</p>
                            </div>
                        </div>

                        <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
                            <p className="text-sm text-gray-700">
                                Photo ID <span className="font-mono font-medium">{shareConfirmation.registryCode}</span> is already associated with:
                            </p>
                            <p className="mt-1 font-medium text-gray-900">
                                {shareConfirmation.existingCustomer.name}
                                {shareConfirmation.existingCustomer.phone && (
                                    <span className="font-normal text-gray-600"> ({shareConfirmation.existingCustomer.phone})</span>
                                )}
                            </p>
                            <p className="mt-2 text-sm text-gray-600">
                                Do you want to use this Photo ID for the current customer as well?
                            </p>
                        </div>

                        {errors['reprint.registry_code'] && (
                            <p className="mb-4 text-sm text-red-600">{errors['reprint.registry_code']}</p>
                        )}

                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => {
                                    setShareConfirmation(null);
                                    setConfirmShare(false);
                                }}
                                className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setConfirmShare(true);
                                    setErrors({});
                                }}
                                className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
                            >
                                Yes, Share Photo ID
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </StaffLayout>
    );
}