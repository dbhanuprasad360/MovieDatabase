function Pagination({ pageNumber, nextFn, prevFn, goToPage }) {
  function getPageNumbers() {
    const pages = [];

    if (pageNumber <= 4) {
      for (let i = 1; i <= Math.min(5, pageNumber + 2); i++) {
        pages.push(i);
      }
      pages.push("...");
      pages.push(10);
    } else {
      pages.push(1);
      pages.push("...");
      for (let i = pageNumber - 1; i <= pageNumber + 1; i++) {
        pages.push(i);
      }
      pages.push("...");
      pages.push(pageNumber + 3);
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
