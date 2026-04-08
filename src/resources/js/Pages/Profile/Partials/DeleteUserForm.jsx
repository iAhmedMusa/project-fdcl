import DangerButton from '@/Components/DangerButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';

export default function DeleteUserForm({ className = '' }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser = (e) => {
        e.preventDefault();
        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        clearErrors();
        reset();
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-base font-semibold text-destructive">Delete Account</h2>
                <p className="mt-0.5 text-sm text-muted-foreground">
                    Once your account is deleted, all of its resources and data will be permanently deleted.
                </p>
            </header>

            <div className="mt-4 rounded-md border border-destructive/20 bg-destructive/5 p-4">
                <p className="text-sm text-muted-foreground">
                    Before deleting your account, please download any data or information that you wish to retain.
                </p>
                <DangerButton className="mt-3" onClick={confirmUserDeletion}>
                    Delete Account
                </DangerButton>
            </div>

            <Modal show={confirmingUserDeletion} onClose={closeModal} maxWidth="md">
                <form onSubmit={deleteUser} className="p-5">
                    <h2 className="text-base font-semibold">
                        Are you sure you want to delete your account?
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        This action cannot be undone. Please enter your password to confirm.
                    </p>

                    <div className="mt-4">
                        <InputLabel htmlFor="password" value="Password" className="sr-only" />
                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            className="w-full"
                            isFocused
                            placeholder="Password"
                        />
                        <InputError message={errors.password} className="mt-1" />
                    </div>

                    <div className="mt-4 flex justify-end gap-2">
                        <SecondaryButton onClick={closeModal}>Cancel</SecondaryButton>
                        <DangerButton disabled={processing}>Delete Account</DangerButton>
                    </div>
                </form>
            </Modal>
        </section>
    );
}
