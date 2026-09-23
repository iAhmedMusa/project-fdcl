import './globals.css';

export const metadata = {
  metadataBase: new URL('https://focusdigitalcolorlab.com'),
  title: {
    default: 'Premium Photo Studio in Dhaka | Focus Digital Color Lab',
    template: '%s | Focus Digital Color Lab',
  },
  description:
    "Dhaka's most trusted premium photo studio since 2009. Professional passport photos, visa photos, photo albums, frames, and mug prints — ready in 10 minutes. Serving Gulshan, Bailey Road, and all of Dhaka.",
  keywords:
    'photo studio Dhaka, Photo Lab, passport photo Dhaka, visa photo Gulshan, photo studio Bailey Road, photo studio near Gulshan, passport size photo Dhaka, FDCL photo studio, photo print Dhaka',
  openGraph: {
    title: 'Premium Photo Studio in Dhaka',
    description:
      "Dhaka's most trusted premium photo studio since 2009. Professional passport photos, visa photos, photo albums, frames, and mug prints — ready in 10 minutes.",
    images: ['/images/studio/studio-04.jpg'],
    type: 'website',
  },
};

export const viewport = {
  themeColor: '#7c3aed',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href="https://focusdigitalcolorlab.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'PhotoStudio',
                  '@id': 'https://focusdigitalcolorlab.com/#studio',
                  name: 'Focus Digital Color Lab',
                  alternateName: 'FDCL Photo Studio',
                  description:
                    'Premium photo studio in Dhaka offering passport photos, visa photos, photo albums, custom frames, and mug prints. Serving Gulshan and Bailey Road since 2009.',
                  url: 'https://focusdigitalcolorlab.com',
                  telephone: '+8801713140768',
                  priceRange: '৳৳',
                  currenciesAccepted: 'BDT',
                  paymentAccepted: 'Cash, bKash, Nagad',
                  openingHours: ['Sa-Th 09:30-21:00', 'Fr 15:00-21:00'],
                  hasMap: 'https://maps.app.goo.gl/UDVbk2jqn4XVSEbVA',
                  image: 'https://focusdigitalcolorlab.com/images/studio/studio-04.jpg',
                  aggregateRating: {
                    '@type': 'AggregateRating',
                    ratingValue: '5.0',
                    reviewCount: '500',
                    bestRating: '5',
                  },
                },
              ],
            }),
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})()`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
