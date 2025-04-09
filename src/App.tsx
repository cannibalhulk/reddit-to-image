import React, { useState, useRef } from 'react';
import { ArrowBigUp, ArrowBigDown, MessageSquare, Share2, BookmarkPlus, MoreHorizontal, Eye, EyeOff, Sun, Moon, Download } from 'lucide-react';
import useSWR from 'swr';
import { useTheme } from './ThemeContext';
import html2canvas from 'html2canvas';

function App() {
  const { theme, toggleTheme } = useTheme();
  const [postUrl, setPostUrl] = useState('');
  const [postId, setPostId] = useState('');
  const [parentPostId, setParentPostId] = useState('');
  const [votes, setVotes] = useState(1);
  const [isUpvoted, setIsUpvoted] = useState(false);
  const [isDownvoted, setIsDownvoted] = useState(false);
  const [showUsername, setShowUsername] = useState(true);
  const [showSubreddit, setShowSubreddit] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);

  const fetcher = async (postId: string) => {
    try {
      if (postId.startsWith('t1_')) {
        // Fetching comment data
        const commentId = postId.replace('t1_', '');
        const response = await fetch(`https://www.reddit.com/comments/${parentPostId}/_/${commentId}.json`);
        const data = await response.json();
        const commentData = data[1]?.data?.children[0]?.data;
        return { ...commentData, title: commentData?.body };
      } else {
        // Fetching post data
        const postIdClean = postId.replace('t3_', '');
        const response = await fetch(`https://www.reddit.com/${postIdClean}.json`);
        const data = await response.json();
        return data[0]?.data?.children[0]?.data;
      }
    } catch (error) {
      console.error('Fetch error:', error);
      throw new Error('Failed to fetch data');
    }
  };

  const { data: postData, error } = useSWR(
    postId ? postId : null,
    fetcher
  );

  const handlePostUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const postMatches = postUrl.match(/\/comments\/([a-zA-Z0-9]+)\//);
    const commentMatches = postUrl.match(/\/comment\/([a-zA-Z0-9]+)\//);
    
    if (commentMatches && commentMatches[1] && postMatches && postMatches[1]) {
      setParentPostId(postMatches[1]);
      setPostId(`t1_${commentMatches[1]}`);
    } else if (postMatches && postMatches[1]) {
      setPostId(`t3_${postMatches[1]}`);
    }
  };

  const handleUpvote = () => {
    if (isUpvoted) {
      setVotes(prev => prev - 1);
      setIsUpvoted(false);
    } else {
      setVotes(prev => prev + (isDownvoted ? 2 : 1));
      setIsUpvoted(true);
      setIsDownvoted(false);
    }
  };

  const handleDownvote = () => {
    if (isDownvoted) {
      setVotes(prev => prev + 1);
      setIsDownvoted(false);
    } else {
      setVotes(prev => prev - (isUpvoted ? 2 : 1));
      setIsDownvoted(true);
      setIsUpvoted(false);
    }
  };

  const handleDownload = async () => {
    if (!contentRef.current) return;

    try {
      const canvas = await html2canvas(contentRef.current, {
        backgroundColor: null,
        scale: 2,
        logging: false,
        useCORS: true
      });
      
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `reddit-content-${new Date().getTime()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  return (
    <div className={`min-h-screen bg-white dark:bg-[#030303] text-gray-900 dark:text-gray-200 py-4 px-2 sm:py-8 sm:px-4 transition-colors duration-200`}>
      <div className="max-w-2xl mx-auto space-y-3 sm:space-y-4">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="fixed top-2 right-2 sm:top-4 sm:right-4 p-2 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={16} className="sm:w-5 sm:h-5" /> : <Moon size={16} className="sm:w-5 sm:h-5" />}
        </button>

        {/* URL Input Form */}
        <form onSubmit={handlePostUrlSubmit} className="bg-gray-100 dark:bg-[#1a1a1b] p-3 sm:p-4 rounded-md">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={postUrl}
              onChange={(e) => setPostUrl(e.target.value)}
              placeholder="Enter Reddit post or comment URL"
              className="flex-1 px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base bg-white dark:bg-[#272729] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-200"
            />
            <button
              type="submit"
              className="px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Load Post
            </button>
          </div>
        </form>

        {/* Download Button */}
        <button 
          onClick={handleDownload}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
          title="Download as JPEG"
        >
          <Download size={16} className="sm:w-5 sm:h-5" />
          <span>Download as JPEG</span>
        </button>

        {/* Privacy Controls */}
        <div className="bg-gray-100 dark:bg-[#1a1a1b] p-3 sm:p-4 rounded-md flex flex-col sm:flex-row gap-2 sm:gap-4">
          <button
            onClick={() => setShowUsername(!showUsername)}
            className="flex items-center justify-center gap-2 px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base bg-white dark:bg-[#272729] rounded-md hover:bg-gray-50 dark:hover:bg-[#323234] transition-colors"
          >
            {showUsername ? <EyeOff size={16} className="sm:w-5 sm:h-5" /> : <Eye size={16} className="sm:w-5 sm:h-5" />}
            {showUsername ? 'Hide' : 'Show'} Username
          </button>
          <button
            onClick={() => setShowSubreddit(!showSubreddit)}
            className="flex items-center justify-center gap-2 px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base bg-white dark:bg-[#272729] rounded-md hover:bg-gray-50 dark:hover:bg-[#323234] transition-colors"
          >
            {showSubreddit ? <EyeOff size={16} className="sm:w-5 sm:h-5" /> : <Eye size={16} className="sm:w-5 sm:h-5" />}
            {showSubreddit ? 'Hide' : 'Show'} Subreddit
          </button>
        </div>

        {/* Post Content */}
        <div className="bg-gray-100 dark:bg-[#1a1a1b] rounded-md" ref={contentRef}>
          {/* Post Header */}
          <div>
            <div className="flex items-center p-2 text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
              <img 
                src={postData?.subreddit_detail?.community_icon || postData?.sr_detail?.icon_img || "https://www.redditstatic.com/desktop2x/img/favicon/android-icon-192x192.png"} 
                alt="Subreddit icon" 
                className="w-4 h-4 sm:w-5 sm:h-5 rounded-full mr-2"
              />
              {showSubreddit ? (
                <>
                  <span className="font-medium">{postData?.subreddit_name_prefixed || 'r/ImageGeneration'}</span>
                  <span className="mx-1">•</span>
                </>
              ):
              (<>
                <span className="font-medium">{'Subreddit'}</span>
                <span className="mx-1">•</span>
              </>)}
              {showUsername ? (
                <>
                  <span>Posted by {postData?.author ? `u/${postData.author}` : 'u/ai_artist'}</span>
                  <span className="mx-1">•</span>
                </>
              ):
              (<>
                <span>Posted by {'a reddit user'}</span>
                <span className="mx-1">•</span>
              </>)}
              <span>2 hours ago</span>
            </div>

            {/* Post Title */}
            <h2 className="px-4 sm:px-8 py-2 text-sm sm:text-lg font-medium">
              {postData?.title || 'AI Generated Landscape - What do you think?'}
            </h2>
          </div>

          {/* Post Actions */}
          <div className="flex items-center px-2 py-2 border-t border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400">
            {/* Votes */}
            <div className="flex items-center space-x-1 mr-2 sm:mr-4">
              <button 
                onClick={handleUpvote}
                className={`p-1 hover:bg-gray-200 dark:hover:bg-gray-800 rounded ${isUpvoted ? 'text-orange-500' : ''}`}
                title="Upvote"
              >
                <ArrowBigUp size={16} className="sm:w-5 sm:h-5" />
              </button>
              <span className={`font-medium text-sm sm:text-base ${isUpvoted ? 'text-orange-500' : isDownvoted ? 'text-blue-500' : ''}`}>
                {postData?.score || votes}
              </span>
              <button 
                onClick={handleDownvote}
                className={`p-1 hover:bg-gray-200 dark:hover:bg-gray-800 rounded ${isDownvoted ? 'text-blue-500' : ''}`}
                title="Downvote"
              >
                <ArrowBigDown size={16} className="sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Comments */}
            <button className="flex items-center space-x-1 p-1 sm:p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded mr-2 sm:mr-4">
              <MessageSquare size={16} className="sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base">{postData?.num_comments || '24'} Comments</span>
            </button>

            {/* Share */}
            <button className="flex items-center space-x-1 p-1 sm:p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded mr-2 sm:mr-4">
              <Share2 size={16} className="sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base">Share</span>
            </button>

            {/* Save */}
            <button className="flex items-center space-x-1 p-1 sm:p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded mr-2 sm:mr-4">
              <BookmarkPlus size={16} className="sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base">Save</span>
            </button>

            {/* More */}
            <button 
              className="p-1 sm:p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded"
              title="More options"
            >
              <MoreHorizontal size={16} className="sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 text-red-500 p-3 sm:p-4 rounded-md text-sm sm:text-base">
            Failed to load post data. Please check the URL and try again.
          </div>
        )}
      </div>
    </div>
  );
}

export default App;