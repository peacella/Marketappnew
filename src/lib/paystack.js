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
  const handler = window.PaystackPop.setup({
    key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
    email,
    amount: amount * 100,
    currency: "NGN",
    ref: `PELLA-${Date.now()}`,
    metadata: {
      custom_fields: [
        { display_name: "Shop", variable_name: "shop", value: "P-ELLA Market" },
      ],
    },
    callback: onSuccess,
    onClose,
  });
  handler.openIframe();
};
