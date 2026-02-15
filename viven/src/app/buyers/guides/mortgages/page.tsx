"use client";

import { Landmark } from "lucide-react";
import {
  GuideLayout,
  GuideSection,
  GuideCallout,
} from "@/components/guides/GuideLayout";

export default function MortgagesGuidePage() {
  return (
    <GuideLayout
      title="Mortgage Types Explained"
      subtitle="A comprehensive guide to the different types of mortgage available in the UK, with pros and cons to help you choose the right one."
      icon={Landmark}
      backHref="/buyers/guides"
      backLabel="All Guides"
      readTime="10 min"
      relatedLinks={[
        { label: "Mortgage Calculator", href: "/buyers/calculators/mortgage" },
        { label: "First-Time Buyer Guide", href: "/buyers/guides/first-time-buyers" },
        { label: "Stamp Duty Calculator", href: "/buyers/calculators/stamp-duty" },
        { label: "Buying Process Guide", href: "/buyers/guides/process" },
      ]}
    >
      <GuideSection title="Introduction">
        <p>
          Choosing the right mortgage is one of the most important financial decisions you will make
          when buying a home. With so many different products available, it can be difficult to know
          which one suits your circumstances best. This guide explains the main types of mortgage
          available in the UK, their advantages and disadvantages, and when each type might be most
          appropriate.
        </p>
        <p>
          Before diving into the different types, it is worth understanding a few key terms. The
          <strong> loan-to-value ratio (LTV)</strong> is the amount you borrow as a percentage of the
          property value. A lower LTV (meaning a larger deposit) generally gives you access to better
          interest rates. The <strong>mortgage term</strong> is the total length of the mortgage,
          typically 25 to 35 years. The <strong>interest rate</strong> determines how much you pay on
          top of repaying the amount borrowed.
        </p>
      </GuideSection>

      <GuideSection title="Fixed-Rate Mortgages">
        <p>
          A fixed-rate mortgage locks your interest rate for a set period, usually two, three, five,
          or sometimes ten years. During this period, your monthly payments stay exactly the same
          regardless of what happens to the Bank of England base rate or the wider economy.
        </p>
        <p>
          <strong>Pros:</strong> Payment certainty makes budgeting straightforward. You are protected
          from interest rate rises during the fixed period. Fixed rates are widely available across
          all LTV bands, and competition between lenders means rates are often very competitive.
        </p>
        <p>
          <strong>Cons:</strong> If interest rates fall, you will not benefit until your fixed period
          ends. Early repayment charges (ERCs) apply if you want to switch or pay off the mortgage
          during the fixed period &mdash; these can be substantial, often 1% to 5% of the
          outstanding balance. Longer fixes tend to have slightly higher rates than shorter ones.
        </p>

        <GuideCallout type="tip">
          <strong>Tip:</strong> A two-year fix gives you flexibility to remortgage sooner, but a
          five-year fix provides longer certainty. If you value stability and do not plan to move
          within five years, a longer fix can be excellent value and saves you the hassle and cost
          of remortgaging every two years.
        </GuideCallout>
      </GuideSection>

      <GuideSection title="Tracker Mortgages">
        <p>
          A tracker mortgage has an interest rate that follows the Bank of England base rate plus a
          set margin. For example, if the base rate is 4.5% and your tracker is set at base rate plus
          1%, your mortgage rate would be 5.5%. When the base rate goes up or down, your payments
          move accordingly.
        </p>
        <p>
          <strong>Pros:</strong> If the base rate falls, your payments reduce automatically. Tracker
          mortgages are transparent &mdash; the rate moves in line with an independent benchmark.
          Some trackers have no early repayment charges, giving you the freedom to switch or overpay
          without penalty.
        </p>
        <p>
          <strong>Cons:</strong> Your payments can increase if the base rate rises, making budgeting
          harder. There is no upper limit on how high payments could go unless your tracker has a
          &quot;cap&quot; (capped trackers are relatively rare). The uncertainty can be stressful for
          those on tight budgets.
        </p>
        <p>
          Tracker mortgages are available as lifetime trackers (for the full mortgage term) or for
          fixed periods (such as a two-year tracker). A two-year tracker typically has a lower
          starting rate than an equivalent two-year fix, but carries the risk of rate increases during
          that period.
        </p>
      </GuideSection>

      <GuideSection title="Standard Variable Rate (SVR) Mortgages">
        <p>
          Every lender has a Standard Variable Rate, which is their default rate. When your
          fixed-rate or tracker deal ends, you will automatically move onto the SVR unless you
          remortgage to a new product. SVRs are set by the lender and can change at any time,
          though they tend to broadly follow the Bank of England base rate.
        </p>
        <p>
          <strong>Pros:</strong> No early repayment charges, so you are free to overpay, switch, or
          pay off your mortgage at any time. This can be useful if you are planning to sell your
          property soon or want maximum flexibility.
        </p>
        <p>
          <strong>Cons:</strong> SVRs are almost always higher than the best fixed or tracker rates
          available. The rate can change at the lender&apos;s discretion, and lenders are not
          obligated to pass on base rate cuts. Staying on the SVR for an extended period can cost
          you thousands of pounds in unnecessary interest.
        </p>

        <GuideCallout type="warning">
          <strong>Warning:</strong> Approximately 800,000 UK homeowners are on their lender&apos;s
          SVR, often without realising they could save hundreds of pounds per month by
          remortgaging. Set a reminder three to six months before your current deal ends to start
          looking at new rates.
        </GuideCallout>
      </GuideSection>

      <GuideSection title="Discount Mortgages">
        <p>
          A discount mortgage offers a set percentage off the lender&apos;s SVR for a fixed period.
          For example, if the SVR is 7% and you have a 2% discount, your rate would be 5%. Unlike
          a tracker, the discount is applied to the SVR rather than the Bank of England base rate.
        </p>
        <p>
          <strong>Pros:</strong> You benefit from any reduction in the SVR. Starting rates can be
          lower than equivalent fixed rates. Some discount deals have no early repayment charges.
        </p>
        <p>
          <strong>Cons:</strong> Because lenders set their own SVR, your payments could increase even
          if the base rate stays the same. The SVR can change at any time and is less transparent
          than a tracker linked to the base rate. Budgeting is more difficult because you cannot
          predict exactly what your payments will be.
        </p>
      </GuideSection>

      <GuideSection title="Offset Mortgages">
        <p>
          An offset mortgage links your savings account to your mortgage. Instead of earning interest
          on your savings, the savings balance is &quot;offset&quot; against your mortgage balance,
          and you only pay interest on the difference. For example, if you have a £200,000 mortgage
          and £30,000 in savings, you would only pay interest on £170,000.
        </p>
        <p>
          <strong>Pros:</strong> You effectively earn a return on your savings equal to your mortgage
          rate, which is tax-free. Your savings remain accessible for emergencies. Over time,
          offsetting can significantly reduce the total interest you pay and help you pay off your
          mortgage faster.
        </p>
        <p>
          <strong>Cons:</strong> Interest rates on offset mortgages tend to be slightly higher than
          standard fixed or tracker rates. You need substantial savings for the offset to make a
          meaningful difference. Your savings will not earn any interest, which could be a
          disadvantage if savings rates are higher than the benefit of offsetting.
        </p>

        <GuideCallout type="info">
          <strong>Good to know:</strong> Offset mortgages are particularly beneficial for
          higher-rate or additional-rate taxpayers. Because the &quot;return&quot; on your savings is
          effectively tax-free, an offset at a mortgage rate of 4% is equivalent to earning 6.67%
          gross for a 40% taxpayer or 7.27% gross for a 45% taxpayer.
        </GuideCallout>
      </GuideSection>

      <GuideSection title="Interest-Only Mortgages">
        <p>
          With an interest-only mortgage, your monthly payments only cover the interest on the loan.
          You do not repay any of the capital during the mortgage term, meaning you still owe the
          full amount borrowed at the end. You need a credible repayment strategy to pay off the
          capital when the term ends.
        </p>
        <p>
          <strong>Pros:</strong> Monthly payments are significantly lower than repayment mortgages.
          This can improve cash flow and allow you to invest the difference elsewhere if you
          believe you can achieve a better return.
        </p>
        <p>
          <strong>Cons:</strong> You must have a realistic plan to repay the full capital at the end
          of the term. Lenders have strict criteria for interest-only mortgages and typically require
          a large deposit (usually 25% or more). If your repayment strategy fails, you could be
          forced to sell your home. Interest-only mortgages are generally only available to borrowers
          with significant equity, savings, or investment income.
        </p>
      </GuideSection>

      <GuideSection title="Repayment Mortgages">
        <p>
          A repayment mortgage (also called a capital and interest mortgage) is the most common type.
          Each monthly payment covers both interest and a portion of the capital, so by the end of
          the mortgage term, you will have paid off the entire loan and own your home outright.
        </p>
        <p>
          <strong>Pros:</strong> You are guaranteed to own your home outright at the end of the term,
          provided you make all payments. Each payment reduces your outstanding balance, building
          your equity in the property. This is the safest and most straightforward way to finance a
          home purchase.
        </p>
        <p>
          <strong>Cons:</strong> Monthly payments are higher than interest-only. In the early years,
          a larger proportion of your payment goes towards interest, with capital repayment
          accelerating as the balance reduces over time.
        </p>
      </GuideSection>

      <GuideSection title="How to Choose the Right Mortgage">
        <p>
          The right mortgage depends on your individual circumstances, risk appetite, and financial
          goals. Consider the following factors when making your decision:
        </p>
        <p>
          <strong>Budget certainty:</strong> If you want to know exactly what your payments will be
          each month, a fixed-rate mortgage is the best choice. The longer the fixed period, the
          greater your certainty.
        </p>
        <p>
          <strong>Risk tolerance:</strong> If you are comfortable with payments going up and down and
          believe interest rates may fall, a tracker mortgage could save you money. However, you must
          be able to afford higher payments if rates rise.
        </p>
        <p>
          <strong>Savings:</strong> If you have significant savings, an offset mortgage could save
          you thousands in interest while keeping your money accessible.
        </p>
        <p>
          <strong>Time horizon:</strong> If you plan to move within a couple of years, a short-term
          fix or a product with no early repayment charges gives you flexibility. If you are
          settling down for the long term, a longer fix provides stability.
        </p>
        <p>
          Whatever type you choose, an independent whole-of-market mortgage broker can search
          thousands of products to find the best deal for your specific situation. Many brokers
          offer a free initial consultation, and their fees are often offset by the savings they find.
        </p>

        <GuideCallout type="tip">
          <strong>Tip:</strong> When comparing mortgages, look at the total cost over the deal period,
          not just the interest rate. A mortgage with a low rate but a high arrangement fee may end up
          costing more than a slightly higher rate with no fee, especially for smaller loan amounts.
        </GuideCallout>
      </GuideSection>
    </GuideLayout>
  );
}
