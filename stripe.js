// Set your secret key. Remember to switch to your live secret key in production!
// See your keys here: https://dashboard.stripe.com/account/apikeys
const stripe = require('stripe')('sk_test_51HO5itK9O2eoAUrKS9XShHrkg2w4mJQlz47UFYF1oUdwSprBaCspJcZvxyYDDl2d4SudYxsb6IURdE6og4W6l2Wo00xnDk8Vul');

const paymentIntent = await stripe.paymentIntents.create({
  amount: 1099,
  currency: 'usd',
  // Verify your integration in this guide by including this parameter
  metadata: {integration_check: 'accept_a_payment'},
});