import { useWorkspaceStore } from "@/store/workspaceStore";
import { useState, useEffect, useCallback } from "react";

const useWorkspaceInviteCode = (workspaceId) => {
  const { getWorkspaceById } = useWorkspaceStore();
  const [inviteCode, setInviteCode] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch workspace invite code by ID
  const fetchInviteCode = useCallback(async () => {
    if (!workspaceId) return;

    setLoading(true);
    setError(null);

    try {
      const workspace = await getWorkspaceById(workspaceId);
      if (workspace?.inviteCode) {
        setInviteCode(workspace.inviteCode);
      }
    } catch (error) {
      console.error("Error fetching invite code:", error);
      setError("Failed to fetch invite code.");
    } finally {
      setLoading(false);
    }
  }, [workspaceId, getWorkspaceById]);

  // Trigger the fetch when workspaceId changes
  useEffect(() => {
    fetchInviteCode();
  }, [fetchInviteCode]);

  return { inviteCode, loading, error, refresh: fetchInviteCode };
};

export default useWorkspaceInviteCode;
