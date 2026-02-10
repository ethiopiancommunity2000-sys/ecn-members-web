import { useEffect, useState, useRef } from "react";
import { Box, CircularProgress } from "@mui/material";
import agent from "../src/app/lib/api/agent";

type ReceiptThumbnailProps = {
  fileId: string;
  size?: number; // Size in pixels (default: 40)
};

const ReceiptThumbnail = ({ fileId, size = 40 }: ReceiptThumbnailProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const imageUrlRef = useRef<string | null>(null);
  const cancelledRef = useRef(false);

  useEffect(() => {
    if (!fileId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    cancelledRef.current = false;

    // Revoke previous URL if it exists
    if (imageUrlRef.current) {
      URL.revokeObjectURL(imageUrlRef.current);
      imageUrlRef.current = null;
    }

    agent.Members.getFile(fileId)
      .then((blob) => {
        // Don't update if effect was cancelled (fileId changed or unmounted)
        if (cancelledRef.current) {
          const url = URL.createObjectURL(blob);
          URL.revokeObjectURL(url); // Clean up immediately
          return;
        }

        const url = URL.createObjectURL(blob);
        imageUrlRef.current = url;
        setImageUrl(url);
        setLoading(false);
      })
      .catch((err) => {
        // Don't update if effect was cancelled
        if (cancelledRef.current) return;

        console.error("Error loading receipt thumbnail:", err);
        setLoading(false);
        // Silently fail for thumbnails - don't show error
      });

    // Cleanup: mark as cancelled and revoke URL
    return () => {
      cancelledRef.current = true;
      if (imageUrlRef.current) {
        URL.revokeObjectURL(imageUrlRef.current);
        imageUrlRef.current = null;
      }
    };
  }, [fileId]);

  if (loading) {
    return (
      <Box
        sx={{
          width: size,
          height: size,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress size={size * 0.5} />
      </Box>
    );
  }

  if (!imageUrl) {
    return null; // Silently fail - don't show anything if image fails to load
  }

  return (
    <Box
      component="img"
      src={imageUrl}
      alt="Receipt thumbnail"
      sx={{
        width: size,
        height: size,
        objectFit: "cover",
        borderRadius: 1,
        border: "1px solid #ddd",
      }}
    />
  );
};

export default ReceiptThumbnail;

