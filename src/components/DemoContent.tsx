import React from 'react';

const DemoContent = () => {
  return (
    <div id="demo-content" className="w-full bg-white font-sans text-gray-800">
      <header className="py-20 px-8 bg-linear-to-b from-blue-50 to-white border-b border-gray-100">
        <h1 className="text-4xl font-bold tracking-tight mb-4">The Art of Digital Navigation</h1>
        <p className="text-xl text-gray-600 max-w-2xl">
          Scroll down to explore this long-form article and test the "Anchor Extension" prototype on the right.
        </p>
      </header>

      <div className="max-w-3xl mx-auto py-12 px-8 space-y-12">
        {Array.from({ length: 15 }).map((_, i) => (
          <section key={i} className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900 leading-tight">
              Section {i + 1}: {titleSamples[i % titleSamples.length]}
            </h2>
            <p className="text-lg leading-relaxed text-gray-600">
              {paragraphSamples[i % paragraphSamples.length]}
            </p>
            <div className="h-48 w-full bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100 border-dashed">
              <span className="text-gray-400 font-mono">Visual Placeholder {i + 1}</span>
            </div>
          </section>
        ))}
      </div>

      <footer className="py-20 bg-gray-50 text-center border-t border-gray-200">
        <p className="text-gray-400">End of the demo content.</p>
      </footer>
    </div>
  );
};

const titleSamples = [
  "Understanding User Behavior",
  "Design Patterns for Success",
  "The Future of Web Interactivity",
  "Optimizing for High Performance",
  "Accessibility in Modern Apps"
];

const paragraphSamples = [
  "In the rapidly evolving landscape of web development, staying ahead means more than just knowing the latest frameworks. It involves a deep understanding of how users interact with content and what drives their engagement.",
  "Great design is often invisible. It’s the seamless transition between views, the intuitive placement of a button, and the subtle feedback that tells a user their action was successful. This philosophy should guide every pixel we place.",
  "When building for the web, reach is everything. But reach without performance is a missed opportunity. A site that loads slowly or feels sluggish will drive away users no matter how valuable the content is.",
  "Standardized tools and shared aesthetics have made the web more consistent, but sometimes at the cost of distinctiveness. We must find the balance between familiar usability and unique brand identity.",
  "Accessibility is not a feature; it's a fundamental right. Designing for all users ensures that our digital experiences are inclusive, robust, and truly global in their impact."
];

export default DemoContent;
