function RightSidebar() {
  return (
    <div className="space-y-6">
      
      {/* Trending */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
        <h2 className="text-xl font-bold mb-4">
          Trending Technologies
        </h2>

        <div className="space-y-3 text-zinc-300">
          <p># React</p>
          <p># Node.js</p>
          <p># AI</p>
          <p># Docker</p>
          <p># SpringBoot</p>
        </div>
      </div>

      {/* Suggested */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
        <h2 className="text-xl font-bold mb-4">
          Suggested Developers
        </h2>

        <div className="space-y-4">
          <div>
            <p className="font-semibold">
              Alex
            </p>

            <p className="text-zinc-400 text-sm">
              MERN Developer
            </p>
          </div>

          <div>
            <p className="font-semibold">
              John
            </p>

            <p className="text-zinc-400 text-sm">
              Java Backend Engineer
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}

export default RightSidebar;