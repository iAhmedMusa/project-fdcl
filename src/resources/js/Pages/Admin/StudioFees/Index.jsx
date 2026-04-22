import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function StudioFeesIndex({ studioFees, availableLocations }) {
    const [showAddForm, setShowAddForm] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState('');
    const [fee, setFee] = useState('200');
    const [editingId, setEditingId] = useState(null);
    const [editFee, setEditFee] = useState('');
    const [errors, setErrors] = useState({});

    const handleAdd = (e) => {
        e.preventDefault();
        setErrors({});

        router.post('/admin/studio-fees', {
            location_id: selectedLocation,
            fee: fee,
            is_active: true,
        }, {
            onSuccess: () => {
                setShowAddForm(false);
                setSelectedLocation('');
                setFee('200');
            },
            onError: (errs) => setErrors(errs),
        });
    };

    const handleUpdate = (id) => {
        setErrors({});
        router.put(`/admin/studio-fees/${id}`, {
            fee: editFee,
        }, {
            onSuccess: () => setEditingId(null),
            onError: (errs) => setErrors(errs),
        });
    };

    const handleToggle = (id) => {
        router.patch(`/admin/studio-fees/${id}/toggle-active`, {}, {
            preserveScroll: true,
        });
    };

    return (
        <AdminLayout>
            <Head title="Studio Fees - Admin Panel" />

            <div className="px-4 py-4 sm:px-6 lg:px-8">
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <h1 className="text-lg font-semibold text-foreground">Studio Fees</h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Configure the session fee charged per new photo session at each location
                        </p>
                    </div>
                    {availableLocations.length > 0 && (
                        <button
                            onClick={() => setShowAddForm(!showAddForm)}
                            className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90"
                        >
                            Add Studio Fee
                        </button>
                    )}
                </div>

                {showAddForm && (
                    <div className="mb-4 rounded-lg bg-card p-4 shadow-sm border">
                        <h3 className="text-sm font-medium text-foreground mb-3">Add New Studio Fee</h3>
                        <form onSubmit={handleAdd} className="flex flex-wrap items-end gap-4">
                            <div className="min-w-[200px]">
                                <label className="block text-xs font-medium text-muted-foreground mb-1">Location</label>
                                <select
                                    value={selectedLocation}
                                    onChange={(e) => setSelectedLocation(e.target.value)}
                                    className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                >
                                    <option value="">Select location...</option>
                                    {availableLocations.map((loc) => (
                                        <option key={loc.id} value={loc.id}>{loc.name}</option>
                                    ))}
                                </select>
                                {errors.location_id && <p className="mt-1 text-xs text-destructive">{errors.location_id}</p>}
                            </div>
                            <div className="min-w-[120px]">
                                <label className="block text-xs font-medium text-muted-foreground mb-1">Fee (৳)</label>
                                <input
                                    type="number"
                                    min="0"
                                    step="1"
                                    value={fee}
                                    onChange={(e) => setFee(e.target.value)}
                                    className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                />
                                {errors.fee && <p className="mt-1 text-xs text-destructive">{errors.fee}</p>}
                            </div>
                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                                >
                                    Save
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setShowAddForm(false); setErrors({}); }}
                                    className="rounded-md border border-input px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {availableLocations.length === 0 && !showAddForm && studioFees.length > 0 && (
                    <p className="mb-4 text-sm text-muted-foreground">All locations have a studio fee configured.</p>
                )}

                <div className="rounded-lg bg-card shadow-sm border overflow-hidden">
                    <table className="min-w-full divide-y divide-border">
                        <thead className="bg-muted/50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Location</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Studio Fee</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {studioFees.map((sf) => (
                                <tr key={sf.id} className={!sf.is_active ? 'opacity-50' : ''}>
                                    <td className="px-4 py-3 text-sm font-medium text-foreground">{sf.location_name}</td>
                                    <td className="px-4 py-3 text-sm text-foreground">
                                        {editingId === sf.id ? (
                                            <div className="flex items-center gap-2">
                                                <span className="text-muted-foreground">৳</span>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    step="1"
                                                    value={editFee}
                                                    onChange={(e) => setEditFee(e.target.value)}
                                                    className="w-24 rounded-md border border-input bg-background px-2 py-1 text-sm"
                                                    autoFocus
                                                />
                                                <button
                                                    onClick={() => handleUpdate(sf.id)}
                                                    className="rounded bg-primary px-2 py-1 text-xs text-primary-foreground hover:bg-primary/90"
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    onClick={() => setEditingId(null)}
                                                    className="rounded border border-input px-2 py-1 text-xs text-foreground hover:bg-muted"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        ) : (
                                            <span>৳{sf.fee.toFixed(0)}</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        <button
                                            onClick={() => handleToggle(sf.id)}
                                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                sf.is_active
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-gray-100 text-gray-800'
                                            }`}
                                        >
                                            {sf.is_active ? 'Active' : 'Inactive'}
                                        </button>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        {editingId !== sf.id && (
                                            <button
                                                onClick={() => { setEditingId(sf.id); setEditFee(sf.fee.toString()); }}
                                                className="text-sm text-primary hover:text-primary/80"
                                            >
                                                Edit
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {studioFees.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-4 py-8 text-center text-sm text-muted-foreground">
                                        No studio fees configured. Click "Add Studio Fee" to get started.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}