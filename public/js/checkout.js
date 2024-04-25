const stripe = Stripe("pk_test_51P3hFzDn1kfev6yXMdv9nI5toOeNg8Z3uaKLxb2pnFkpNtNY6zHxBliCjzGdjTEXQh4cH48OYlkVSfXeIp0iboNH000lNRR5Bk");

initialize()

async function initialize() {
  const fetchClientSecret = async () => {
    const response = await fetch("/create-checkout-session", {
      method: "POST",
    })
    const { clientSecret } = await response.json();
    return clientSecret
  }

  const checkout = await stripe.initEmbeddedCheckout({
    fetchClientSecret,
  })

  checkout.mount('#checkout')
}