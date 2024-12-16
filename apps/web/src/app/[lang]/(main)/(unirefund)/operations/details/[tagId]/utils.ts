"use client";

export function getStatusColor(status: string) {
  switch (status) {
    case "None":
      return "text-gray-200"; // Durum belirlenmemiş
    case "Open":
    case "Issued":
    case "ExportValidated":
      return "text-green-700"; // İşlem başladı
    case "PreIssued":
      return "text-yellow-400"; // Hazırlık aşaması
    case "WaitingGoodsValidation":
    case "WaitingStampValidation":
      return "text-yellow-500"; // Bekleyen işlemler
    case "Declined":
    case "Cancelled":
    case "Expired":
      return "text-red-500"; // İptal edilmiş, sona ermiş
    case "PaymentBlocked":
    case "PaymentProblem":
      return "text-red-400"; // Ödeme engellenmiş veya problem var
    case "PaymentInProgress":
    case "Paid":
      return "text-blue-500"; // Ödeme süreci veya tamamlanmış ödeme
    case "Correction":
      return "text-blue-400"; // Düzeltme aşaması
    case "OptedOut":
      return "text-gray-400"; // Durumdan çıkmış
    default:
      return "text-gray-400"; // Bilinmeyen durum
  }
}
export function dateToString(date: string | null | undefined, locale: string) {
  if (!date) return "";

  return new Date(date).toLocaleDateString(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
