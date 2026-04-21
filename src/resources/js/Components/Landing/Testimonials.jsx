import FadeIn from '@/Components/FadeIn';

const reviews = [
    {
        name: 'Rafiqul Islam',
        role: 'Passport Applicant',
        rating: 5,
        text: 'Walked in without an appointment and had my passport size photos ready in under 10 minutes. Sharp, well-lit, and the print quality was excellent. Accepted at the passport office without any issue. Reliable and fast — exactly what you need.',
        location: 'Gulshan Branch',
        initial: 'R',
        color: 'bg-violet-600',
    },
    {
        name: 'Tasnim Hossain',
        role: 'Corporate Mug Order',
        rating: 5,
        text: 'We ordered custom photo mugs for our team as company gifts. The colors were vibrant and the print quality held up perfectly. The team handled our bulk order efficiently and delivered on time. Will definitely order again for our next corporate event.',
        location: 'Bailey Road Branch',
        initial: 'T',
        color: 'bg-rose-600',
    },
    {
        name: 'Arif Hasan',
        role: 'Urgent Visa Application',
        rating: 5,
        text: 'Needed urgent visa application size photos the evening before my submission deadline. Came in at 7 PM and they had everything ready in under 15 minutes — correct background, right dimensions, printed and digital both. Saved the day. Absolutely recommend.',
        location: 'Bailey Road Branch',
        initial: 'A',
        color: 'bg-amber-600',
    },
    {
        name: 'Sumaiya Rahman',
        role: 'Schengen Visa',
        rating: 5,
        text: 'I was worried about the strict Schengen photo requirements but the team here knew everything. Photos were perfect. I got my visa approved. Cannot thank them enough!',
        location: 'Gulshan Branch',
        initial: 'S',
        color: 'bg-cyan-600',
    },
    {
        name: 'Farhana Begum',
        role: 'Parent — School Admission',
        rating: 5,
        text: 'Brought my 6-year-old daughter for her school admission photos. The staff was incredibly patient and made her feel comfortable — she was smiling naturally in minutes! Photos came out beautifully. Will come back for every ID photo she needs.',
        location: 'Bailey Road Branch',
        initial: 'F',
        color: 'bg-pink-600',
    },
    {
        name: 'Kamal Hossain',
        role: 'Parent — ID Card Photo',
        rating: 5,
        text: 'My son needed photos for his school ID card and student file. The team here took extra care — they adjusted the lighting specially for kids and made sure he sat still without rushing him. The photos were accepted first time. Highly recommend for families with young children.',
        location: 'Gulshan Branch',
        initial: 'K',
        color: 'bg-indigo-600',
    },
];

function StarRating({ count }) {
    return (
        <div className="flex gap-0.5">
            {Array.from({ length: count }).map((_, i) => (
                <svg key={i} className="h-4 w-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ))}
        </div>
    );
}

export default function Testimonials() {
    return (
        <section id="reviews" className="bg-gray-50 px-4 py-20 dark:bg-gray-900 sm:px-6 lg:py-24">
            <div className="mx-auto max-w-7xl">
                <FadeIn className="mb-12 text-center">
                    <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary dark:bg-primary/20">
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        5.0 on Google
                    </span>
                    <h2 className="mt-4 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
                        What Our Customers Say
                    </h2>
                    <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
                        Over 500 five-star reviews from customers across Dhaka — from Gulshan to Mirpur, Uttara to Dhanmondi.
                    </p>
                </FadeIn>

                <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:pb-0 lg:grid-cols-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {reviews.map((review, index) => (
                        <FadeIn key={review.name} delay={index * 80} className="shrink-0 w-[82vw] snap-start sm:w-auto">
                        <div
                            className="flex flex-col h-full rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
                        >
                            {/* Stars */}
                            <StarRating count={review.rating} />

                            {/* Review text */}
                            <p className="mt-4 flex-1 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                                "{review.text}"
                            </p>

                            {/* Reviewer */}
                            <div className="mt-6 flex items-center gap-3 border-t border-gray-100 pt-4 dark:border-gray-700">
                                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${review.color} text-sm font-bold text-white`}>
                                    {review.initial}
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900 dark:text-white">{review.name}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {review.role} · {review.location}
                                    </p>
                                </div>
                                <div className="ml-auto">
                                    <svg className="h-5 w-5 text-gray-300 dark:text-gray-600" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        </FadeIn>
                    ))}
                </div>

                <div className="mt-10 text-center">
                    <a
                        href="https://maps.app.goo.gl/UDVbk2jqn4XVSEbVA"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 font-semibold text-gray-700 shadow-sm transition-all hover:border-primary/30 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 cursor-pointer"
                    >
                        <svg className="h-5 w-5 text-primary" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                        </svg>
                        Read All Reviews on Google
                    </a>
                </div>
            </div>
        </section>
    );
}
