import type { Metadata } from 'next';
import './globals.css';
import { ToastProvider } from '@/components/Toast';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Exam Portal — Practice Smarter. Perform Better.',
  description: 'Turn your MCQ question papers in PDF or Word into interactive Computer Based Test (CBT) mock exams with countdown timer, question palette, negative marking, and instant result analytics.',
  keywords: 'CBT mock test, online exam portal, SSC CGL practice, banking mock test, PDF MCQ extractor, question paper to CBT',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex flex-col min-h-screen antialiased selection:bg-indigo-500 selection:text-white">
        <ToastProvider>
          <Navbar />
          <main className="flex-1 flex flex-col">{children}</main>
          <Footer />
        </ToastProvider>
      </body>
    </html>
  );
}
