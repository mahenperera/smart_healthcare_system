import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { paymentApi } from "../../api/payment-api";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { CreditCard, ShieldCheck, ArrowLeft, Loader2 } from "lucide-react";

// Initialize Stripe with publishable key
const stripePromise = loadStripe("pk_test_51TSEFXF5KxC70MAP10dUj4nFXeRvFkmDo8XEzlh6xAstZ66keBAale1lVIaMwsyEfc56cIZnIAqgbD6YxsFwIHnA00dYb79zb4");

function CheckoutForm({ amount, appointmentId, onBack }) {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const [paymentId, setPaymentId] = useState(null);

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    createIntent();
  }, [amount, appointmentId]);

  async function createIntent() {
    try {
      const response = await paymentApi.createIntent({
        patientId: user.userId,
        appointmentId: appointmentId,
        amount: amount,
        currency: "lkr"
      });
      setClientSecret(response.clientSecret);
      setPaymentId(response.paymentId);
    } catch (err) {
      setError("Failed to initialize payment. Please try again.");
      console.error(err);
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      return;
    }

    setProcessing(true);

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          email: user.email,
        },
      },
    });

    if (result.error) {
      setError(result.error.message);
      setProcessing(false);
    } else {
      if (result.paymentIntent.status === "succeeded") {
        // Confirm with our backend
        try {
          await paymentApi.confirm(paymentId);
          navigate("/appointments", { state: { success: "Payment successful! Your appointment is confirmed." } });
        } catch (err) {
          setError("Payment succeeded but failed to update record. Please contact support.");
          setProcessing(false);
        }
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
        <div className="flex items-center justify-between mb-6">
          <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Amount to Pay</span>
          <span className="text-2xl font-black text-slate-900">LKR {amount.toLocaleString()}</span>
        </div>
        
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-inner">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#0f172a",
                  "::placeholder": {
                    color: "#94a3b8",
                  },
                },
                invalid: {
                  color: "#ef4444",
                },
              },
            }}
          />
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 font-medium">
          {error}
        </div>
      )}

      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={processing}
          className="flex-1 h-12 rounded-xl font-bold border-slate-200"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={!stripe || processing || !clientSecret}
          className="flex-1 h-12 rounded-xl bg-slate-950 hover:bg-slate-900 text-white font-black uppercase tracking-widest shadow-lg shadow-slate-200"
        >
          {processing ? (
            <div className="flex items-center gap-2">
              <Loader2 className="animate-spin" size={18} />
              Processing...
            </div>
          ) : (
            `Pay LKR ${amount.toLocaleString()}`
          )}
        </Button>
      </div>
      
      <div className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.1em] text-slate-400">
        <ShieldCheck size={14} className="text-emerald-500" />
        Secure payment processed by Stripe
      </div>
    </form>
  );
}

export default function PaymentPage() {
  const { appointmentId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { amount, doctorName } = location.state || { amount: 1500, doctorName: "Doctor" };

  return (
    <div className="mx-auto max-w-xl px-4 py-12">
      <Button 
        variant="ghost" 
        onClick={() => navigate(-1)} 
        className="mb-8 flex items-center gap-2 rounded-2xl text-slate-500 hover:text-slate-950 font-bold"
      >
        <ArrowLeft size={18} /> Back
      </Button>

      <Card className="rounded-[40px] border-slate-200 shadow-2xl overflow-hidden bg-white">
        <CardHeader className="bg-slate-950 text-white p-8 md:p-10">
          <div className="flex items-center gap-4 mb-2">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <CreditCard className="text-emerald-400" size={20} />
            </div>
            <CardTitle className="text-2xl font-black">Checkout</CardTitle>
          </div>
          <CardDescription className="text-slate-400 font-medium">
            Complete your payment for appointment with <span className="text-white font-bold">{doctorName}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8 md:p-10">
          <Elements stripe={stripePromise}>
            <CheckoutForm 
              amount={amount} 
              appointmentId={appointmentId} 
              onBack={() => navigate(-1)} 
            />
          </Elements>
        </CardContent>
      </Card>
    </div>
  );
}
