import { useQuery } from "@tanstack/react-query";
import { api, apiRoot, unwrapList } from "@/lib/admin-api";

export type KycRecord = {
  kycId?: string;
  userId?: string;
  firstName?: string;
  lastName?: string;
  profilePic?: string;
  documentType?: string;
  frontImage?: string;
  backImage?: string;
  status?: number | string;
  submittedAt?: string;
  rejectionReason?: string;
};

export type PendingProfileImage = {
  _id?: string;
  image?: string;
  status?: number | string;
};

export type PendingProfileImageGroup = {
  userId?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  mobile?: string;
  phone?: string;
  currentProfileImage?: string;
  pendingImages?: PendingProfileImage[];
};

export function useKycList(type: number) {
  return useQuery({
    queryKey: ["admin", "kyc", type],
    queryFn: async () => {
      const response = await apiRoot.get("/kyc/list", {
        params: { type, page: 1, limit: 20 },
      });
      return unwrapList<KycRecord>(response.data, "kyc", "records");
    },
    retry: 1,
  });
}

export function reviewKyc(kycId: string, status: 2 | 3, rejectionReason?: string) {
  const formData = new FormData();
  formData.append("status", String(status));
  if (status === 3) formData.append("rejectionReason", rejectionReason?.trim() ?? "");
  return apiRoot.put(`/kyc/review/${kycId}`, formData);
}

export function usePendingProfileImages() {
  return useQuery({
    queryKey: ["admin", "pending-profile-images"],
    queryFn: async () => {
      const response = await api.get("/pending-images");
      return unwrapList<PendingProfileImageGroup>(response.data, "providers");
    },
    retry: 1,
  });
}

export function reviewProfileImage(
  providerId: string,
  imageId: string,
  status: 1 | 2,
  rejectionReason = "",
) {
  const formData = new FormData();
  formData.append("providerId", providerId);
  formData.append("imageId", imageId);
  formData.append("status", String(status));
  formData.append("rejectionReason", rejectionReason.trim());
  return api.put("/review-image", formData);
}