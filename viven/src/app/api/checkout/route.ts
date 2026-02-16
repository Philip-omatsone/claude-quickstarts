import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-01-28.clover",
    })
  : null;

export async function POST(request: NextRequest) {
  try {
    if (!stripe) {
      return NextResponse.json(
        { error: "Payments not configured" },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { postcode, address } = body;

    if (!postcode) {
      return NextResponse.json(
        { error: "Postcode is required" },
        { status: 400 }
      );
    }

    const origin = request.nextUrl.origin;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "gbp",
            product_data: {
              name: "Viven Buyer Report",
              description: `Comprehensive property report for ${address || postcode}`,
            },
            unit_amount: 999,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/report/buyer/generating?session_id={CHECKOUT_SESSION_ID}&postcode=${encodeURIComponent(postcode)}&address=${encodeURIComponent(address || "")}`,
      cancel_url: `${origin}/buyers?cancelled=true`,
      metadata: {
        postcode,
        address: address || "",
        reportType: "buyer",
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
