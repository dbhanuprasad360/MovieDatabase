function Pagination({ pageNumber, nextFn, prevFn, goToPage }) {
  function getPageNumbers() {
    const pages = [];

    if (pageNumber === 1) {
      // on page 1 — just show 1 and 2
      pages.push(1);
      pages.push(2);
    } else {
      // always show 1 as home option if we're past page 2
      if (pageNumber > 2) {
        pages.push(1);
        if (pageNumber > 3) pages.push("...");
      }
      // previous, current, next
      pages.push(pageNumber - 1);
      pages.push(pageNumber);
      pages.push(pageNumber + 1);
    }
    return pages;
  }

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-center gap-2 my-10">
      {/* PREV */}
      <button
        onClick={prevFn}
        disabled={pageNumber === 1}
        className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium
          border transition-all duration-200
          ${
            pageNumber === 1
              ? "border-white/10 text-gray-600 cursor-not-allowed"
              : "border-white/20 text-gray-300 hover:border-green-500/50 hover:text-green-400"
          }`}
      >
        ← Prev
      </button>

      {/* PAGE NUMBERS */}
      <div className="flex items-center gap-1">
        {pageNumbers.map((page, index) =>
          page === "..." ? (
            <span
              key={`dots-${index}`}
              className="w-8 text-center text-gray-600 text-sm"
            >
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => goToPage(page)} // ✅ direct jump
              className={`w-9 h-9 rounded-lg text-sm font-medium transition-all duration-200
                ${
                  page === pageNumber
                    ? "bg-green-500 text-white border border-green-500"
                    : "border border-white/20 text-gray-400 hover:border-green-500/50 hover:text-green-400"
                }`}
            >
              {page}
            </button>
          ),
        )}
      </div>

      {/* NEXT */}
      <button
        onClick={nextFn}
        className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium
          border border-white/20 text-gray-300
          hover:border-green-500/50 hover:text-green-400 transition-all duration-200"
      >
        Next →
      </button>
    </div>
  );
}

export default Pagination;
