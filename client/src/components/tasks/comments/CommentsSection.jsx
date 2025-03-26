import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Comment from "./Comment";
import CommentForm from "./CommentForm";
import { useProfileStore } from "@/store/profileStore";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import DottedSeperator from "@/components/common/DottedSeperator";
import { getAvatarColor, getAvatarFallbackText } from "@/lib/avatar.utils";

const API_URL = `${import.meta.env.VITE_SERVER_URL}/api/comments`;

const CommentsSection = ({ id = null }) => {
  const [comments, setComments] = useState([]);
  const { taskId: paramsTaskId } = useParams();
  const { profile } = useProfileStore();
  const getAllCommentsOfTask = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/${paramsTaskId || id}`);
      setComments(data.comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };
  useEffect(() => {
    if (paramsTaskId || id) {
      getAllCommentsOfTask();
    }
  }, []);

  const addComment = async (content) => {
    try {
      await axios.post(`${API_URL}/${paramsTaskId || id}/create`, content);
      await getAllCommentsOfTask();
      toast({
        title: "Comment added",
        description: "Your comment has been added successfully.",
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Error creating comment",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const updateComment = async (commentId, content) => {
    try {
      await axios.put(`${API_URL}/${commentId}/update`, content);
      await getAllCommentsOfTask();
      toast({
        title: "Comment updated",
        description: "Your comment has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error updating comment",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deleteComment = async (commentId) => {
    try {
      await axios.delete(`${API_URL}/${commentId}/delete`);
      await getAllCommentsOfTask();
      toast({
        title: "Comment deleted",
        description: "Your comment has been deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error deleteing comment",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const avatarFallbackText = getAvatarFallbackText(profile?.name);
  const avatarColor = getAvatarColor(profile?.name);

  return (
    <div className="grid grid-cols-[4fr_3fr] mr-6">
      <div className="w-full max-h-[500px] overflow-y-auto relative">
        <div className="sticky  top-0 bg-white z-10 pb-2 ">
          <p className="text-lg font-semibold mb-4">Comments</p>
          <div className="flex items-start gap-3">
            <Avatar>
              <AvatarFallback className={`${avatarColor}`}>
                {avatarFallbackText}
              </AvatarFallback>
            </Avatar>
            <div className="w-full px-1">
              <CommentForm onSubmit={addComment} />
            </div>
          </div>
          <DottedSeperator className="my-2" />
        </div>

        <div className="space-y-4 p-4 mt-2">
          {comments.map((comment) => (
            <Comment
              key={comment._id}
              comment={comment}
              currentUserId={profile?.userId}
              onUpdate={updateComment}
              onDelete={deleteComment}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
export default CommentsSection;
