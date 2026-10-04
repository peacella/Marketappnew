export const loadPaystackScript = () => {
  return new Promise((resolve) => {
    if (window.PaystackPop) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.onload = resolve;
    document.head.appendChild(script);
  });
};

export const initializePayment = async ({
  email,
  amount,
  onSuccess,
  onClose,
}) => {
  await loadPaystackScript();

  const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;
  if (!publicKey || !publicKey.startsWith('pk_')) {
    throw new Error('Payment is misconfigured (invalid Paystack public key). Please update the app.');
  }

  const handler = window.PaystackPop.setup({
    key: publicKey,
    email,
    amount: amount * 100,
    currency: "NGN",
    ref: `PELLA-${Date.now()}`,
    metadata: {
      custom_fields: [
        { display_name: "Shop", variable_name: "shop", value: "P-ELLA Market" },
      ],
    },
    callback: (response) => {
      onSuccess(response);
    },
    onClose: () => {
      if (onClose) onClose();
    },
  });
  handler.openIframe();
};
