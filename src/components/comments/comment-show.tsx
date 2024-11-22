import Image from "next/image";
import CommentCreateForm from "@/components/comments/comment-create-form";
import { fetchCommentsByPostId } from "@/db/queries/comments";

interface CommentShowProps {
  commentId: string;
  postId: string;
}

// render an individual comment along with its nested replies
export default async function CommentShow({ commentId, postId }: CommentShowProps) {
  const comments = await fetchCommentsByPostId(postId);

  // Find the specific comment by ID
  const comment = comments.find((c) => c.id === commentId);

  if (!comment) {
    return null;
  }

  // Get child comments (nested replies) of the current comment
  const children = comments.filter((c) => c.parentId === commentId);
  // Recursively render each child comment
  const renderedChildren = children.map((child) => {
    return <CommentShow key={child.id} commentId={child.id} postId={postId} />;
  });

  // Render the individual comment with its content, user details, and reply form
  return (
    <div className="p-4 border mt-2 mb-1">
      <div className="flex gap-3">
        <Image src={comment.user.image || ""} alt="user image" width={40} height={40} className="w-10 h-10 rounded-full" />
        <div className="flex-1 space-y-3">
          <p className="text-sm font-medium text-gray-500">{comment.user.name}</p>
          <p className="text-gray-900">{comment.content}</p>

          <CommentCreateForm postId={comment.postId} parentId={comment.id} />
        </div>
      </div>
      <div className="pl-4">{renderedChildren}</div>
    </div>
  );
}
