import {Input} from "@/components/ui/input";
import {InputOTP, InputOTPGroup, InputOTPSlot} from "@/components/ui/input-otp";
import {Label} from "@/components/ui/label";
import {DatePicker} from "@repo/ayasofyazilim-ui/molecules/date-picker";
import type {UniRefund_ContractService_Enums_RefundMethod} from "@repo/saas/TagService";
import {useState} from "react";
import _ from "lodash";
import cardValidator from "card-validator";
import type {TagServiceResource} from "@/language-data/unirefund/TagService";
import {useRefund} from "../client-page";

function PaymentForm({
  refundMethod,
  languageData,
}: {
  refundMethod: UniRefund_ContractService_Enums_RefundMethod;
  languageData: TagServiceResource;
}) {
  const {formData, setFormData, isPending} = useRefund();
  const [validationError, setValidationError] = useState<{cardNumber: boolean; expiryDate: boolean}>({
    cardNumber: false,
    expiryDate: false,
  });

  const expiryDate = `${formData.cardInfo?.cardExpiryMonth}${formData.cardInfo?.cardExpiryYear}`;

  function handleExpiryDateChange(_expiryDate: string) {
    setFormData((prev) => {
      _.set(prev, "cardInfo.cardExpiryMonth", _expiryDate.substring(0, 2) || "");
      _.set(prev, "cardInfo.cardExpiryYear", _expiryDate.substring(2, 4) || "");
      return {...prev};
    });
    const isValid = cardValidator.expirationDate(_expiryDate).isValid;
    setValidationError((prev) => ({...prev, expiryDate: !isValid}));
  }

  function handleCardNumberChange(cardNumber: string) {
    setFormData((prev) => {
      _.set(prev, "cardInfo.cardNumber", cardNumber);
      return {...prev};
    });
    const isValid = cardValidator.number(cardNumber).isValid;
    setValidationError((prev) => ({...prev, cardNumber: !isValid}));
  }

  function onPaidDateChange(date: Date) {
    setFormData((prev) => ({...prev, paidDate: date.toISOString()}));
  }
  if (refundMethod === "Cash") {
    return (
      <div className="mt-4">
        <DatePicker
          defaultValue={new Date(formData.paidDate)}
          disabled={isPending}
          id="cash-refund-date"
          label={languageData.PaidDate}
          onChange={onPaidDateChange}
          useTime
        />
      </div>
    );
  }
  if (refundMethod === "CreditCard") {
    return (
      <div className="mt-4">
        <div className="grid w-full max-w-sm items-center gap-3">
          <Label data-testid="holder-name-label" htmlFor="holder-name">
            Credit Card Holder Name
          </Label>
          <Input data-testid="holder-name-input" id="holder-name" placeholder="Name" type="text" />
        </div>

        <Label className="mb-2 mt-2 block text-sm font-medium" data-testid="card-number-label">
          Credit Card Number
        </Label>
        <InputOTP
          containerClassName="flex-wrap"
          maxLength={16}
          onChange={handleCardNumberChange}
          value={formData.cardInfo?.cardNumber || ""}>
          <div className="flex flex-row flex-wrap items-center gap-3">
            <InputOTPGroup className={`${validationError.cardNumber && "[&>div]:border-red-500"}`}>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
            </InputOTPGroup>
            <InputOTPGroup className={`${validationError.cardNumber && "[&>div]:border-red-500"}`}>
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
              <InputOTPSlot index={6} />
              <InputOTPSlot index={7} />
            </InputOTPGroup>
          </div>
          <div className="flex flex-row flex-wrap items-center gap-3">
            <InputOTPGroup className={`${validationError.cardNumber && "[&>div]:border-red-500"}`}>
              <InputOTPSlot index={8} />
              <InputOTPSlot index={9} />
              <InputOTPSlot index={10} />
              <InputOTPSlot index={11} />
            </InputOTPGroup>
            <InputOTPGroup className={`${validationError.cardNumber && "[&>div]:border-red-500"}`}>
              <InputOTPSlot index={12} />
              <InputOTPSlot index={13} />
              <InputOTPSlot index={14} />
              <InputOTPSlot index={15} />
            </InputOTPGroup>
          </div>
        </InputOTP>
        <Label className="mb-2 mt-2 block text-sm font-medium" data-testid="expiry-date-label">
          Month/Year
        </Label>
        <InputOTP containerClassName="flex-wrap" maxLength={4} onChange={handleExpiryDateChange} value={expiryDate}>
          <InputOTPGroup className={`${validationError.expiryDate && "[&>div]:border-red-500"}`}>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
          </InputOTPGroup>
          /
          <InputOTPGroup className={`${validationError.expiryDate && "[&>div]:border-red-500"}`}>
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
          </InputOTPGroup>
        </InputOTP>
      </div>
    );
  }
  return null;
}

export default PaymentForm;
