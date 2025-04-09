export const PostSkeleton = () => (
    <div className="bg-gray-100 dark:bg-[#1a1a1b] rounded-md animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center p-2">
        <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-gray-300 dark:bg-gray-700 mr-2"></div>
        <div className="flex space-x-1">
          <div className="w-16 h-3 bg-gray-300 dark:bg-gray-700 rounded"></div>
          <div className="w-3 h-3 bg-gray-300 dark:bg-gray-700 rounded"></div>
          <div className="w-24 h-3 bg-gray-300 dark:bg-gray-700 rounded"></div>
          <div className="w-3 h-3 bg-gray-300 dark:bg-gray-700 rounded"></div>
          <div className="w-12 h-3 bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>
      </div>

      {/* Title Skeleton */}
      <div className="px-4 sm:px-8 py-2">
        <div className="w-3/4 h-5 bg-gray-300 dark:bg-gray-700 rounded"></div>
      </div>

      {/* Content Skeleton */}
      <div className="px-4 sm:px-8 pb-2">
        <div className="w-full h-64 bg-gray-300 dark:bg-gray-700 rounded"></div>
      </div>

      {/* Actions Skeleton */}
      <div className="flex items-center px-2 py-2 border-t border-gray-200 dark:border-gray-800">
        <div className="flex items-center space-x-4">
          <div className="flex space-x-2">
            <div className="w-5 h-5 bg-gray-300 dark:bg-gray-700 rounded"></div>
            <div className="w-8 h-5 bg-gray-300 dark:bg-gray-700 rounded"></div>
            <div className="w-5 h-5 bg-gray-300 dark:bg-gray-700 rounded"></div>
          </div>
          <div className="w-20 h-5 bg-gray-300 dark:bg-gray-700 rounded"></div>
          <div className="w-12 h-5 bg-gray-300 dark:bg-gray-700 rounded"></div>
          <div className="w-12 h-5 bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    </div>
  );