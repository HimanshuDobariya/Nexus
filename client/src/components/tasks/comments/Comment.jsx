import { getAvatarFallbackText, getAvatarColor } from "@/lib/avatar.utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { format, formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import CommentForm from "./CommentForm";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ConfirmationDilog from "@/components/common/ConfirmationDilog";

const Comment = ({ comment, currentUserId, onUpdate, onDelete }) => {
  const avatarFallbackText = getAvatarFallbackText(comment?.author.name);
  const avatarColor = getAvatarColor(comment?.author.name);
  const isOwner = comment?.author._id === currentUserId;
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const formatTimestamp = (comment) => {
    const date = new Date(comment.updatedAt || comment.createdAt);
    return format(date, 'dd/MM/yyyy, hh:mm a'); 
    // return format(date, 'PPpp')
  };

  const handleUpdate = async (data) => {
    await onUpdate(comment._id, data);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    await onDelete(comment._id);
    setIsDeleteDialogOpen(false);
  };

  return (
    <>
      <div className="flex items-start gap-3">
        <Avatar>
          <AvatarFallback className={`${avatarColor}`}>
            {avatarFallbackText}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-1">
          <div className="bg-neutral-100 p-3 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <span className="font-medium">{comment?.author.name}</span>
                <span className="text-xs text-muted-foreground ml-2">
                  {formatTimestamp(comment)}
                  {comment?.updatedAt !== comment?.createdAt && " (edited)"}
                </span>
              </div>

              {isOwner && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="size-8">
                      <MoreHorizontal className="size-4" />
                      <span className="sr-only">More options</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setIsEditing(true)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setIsDeleteDialogOpen(true)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            {isEditing ? (
              <div className="mt-2">
                <CommentForm
                  initialValue={comment.content}
                  onSubmit={handleUpdate}
                  onCancel={() => setIsEditing(false)}
                  submitLabel="Save"
                />
              </div>
            ) : (
              <div className="mt-1">{comment.content}</div>
            )}
          </div>
        </div>
      </div>

      <ConfirmationDilog
        title="Delete comment"
        description="Are you sure you want to delete this comment? This action cannot be undone."
        confirmText="Delete"
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        handleConfirm={handleDelete}
        handleCancel={() => {
          setIsDeleteDialogOpen(false);
        }}
      />
    </>
  );
};
export default Comment;
