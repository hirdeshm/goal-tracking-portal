import { supabase } from "./supabase";

export async function createAuditLog(
  userId: string,
  action: string,
  entityType: string,
  entityId: string,
  oldData: any,
  newData: any
) {
  await supabase.from("audit_logs").insert({
    user_id: userId,
    action,
    entity_type: entityType,
    entity_id: entityId,
    old_data: oldData,
    new_data: newData,
  });
}