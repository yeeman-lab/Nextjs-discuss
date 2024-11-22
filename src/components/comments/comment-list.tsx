import CommentShow from "@/components/comments/comment-show";
import { fetchCommentsByPostId } from "@/db/queries/comments";

interface CommentListProps {
  postId: string;
}

// fetches and displays all comments for a given post
export default async function CommentList({ postId }: CommentListProps) {
  const comments = await fetchCommentsByPostId(postId);

  // Filter out top-level comments (those with no parent comment)
  const topLevelComments = comments.filter((comment) => comment.parentId === null);
  // Map through top-level comments and render each with the CommentShow component
  const renderedComments = topLevelComments.map((comment) => {
    return <CommentShow key={comment.id} commentId={comment.id} postId={postId} />;
  });

  return (
    <div className="space-y-3">
      {/* Display a heading showing the total number of comments */}
      <h1 className="text-lg font-bold">All {comments.length} comments</h1>
      {/* Render all top-level comments */}
      {renderedComments}
    </div>
  );
}
