import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = 'Slide <noreply@slide.so>'
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export async function sendApplicationAccepted({
  to,
  creatorName,
  briefTitle,
  brandName,
  briefId,
}: {
  to: string
  creatorName: string
  briefTitle: string
  brandName: string
  briefId: string
}) {
  try {
    await resend.emails.send({
      from: FROM,
      to,
      subject: `Your application has been accepted`,
      html: `
        <p>Hi ${creatorName},</p>
        <p>Good news. <strong>${brandName}</strong> has accepted your application for &ldquo;<strong>${briefTitle}</strong>&rdquo;.</p>
        <p>Head back to the brief to see the next steps and get started.</p>
        <p><a href="${BASE_URL}/briefs/${briefId}">View brief</a></p>
        <p>The Slide team</p>
      `,
    })
  } catch {
    // Email failure does not block the accept action
  }
}

export async function sendVerificationRejected({
  to,
  creatorName,
  reason,
}: {
  to: string
  creatorName: string
  reason: string
}) {
  try {
    await resend.emails.send({
      from: FROM,
      to,
      subject: 'Update on your Slide verification',
      html: `
        <p>Hi ${creatorName},</p>
        <p>Thank you for submitting your sample videos for Slide verification. After reviewing your submission, we are not able to approve your profile at this time.</p>
        <p><strong>Feedback from our team:</strong></p>
        <blockquote style="border-left: 3px solid #1ee231; padding-left: 12px; color: #555;">${reason}</blockquote>
        <p>You are welcome to re-submit at any time once you have addressed the feedback. Head to your profile to upload new samples.</p>
        <p><a href="${BASE_URL}/profile/verification">Re-submit samples</a></p>
        <p>The Slide team</p>
      `,
    })
  } catch {
    // Email failure does not block the reject action
  }
}

export async function sendVerificationApproved({
  to,
  creatorName,
}: {
  to: string
  creatorName: string
}) {
  try {
    await resend.emails.send({
      from: FROM,
      to,
      subject: 'You are verified on Slide',
      html: `
        <p>Hi ${creatorName},</p>
        <p>Great news — your Slide verification has been approved. You now have a verified badge on your profile and access to a wider range of briefs.</p>
        <p>Head back to your dashboard to start swiping.</p>
        <p><a href="${BASE_URL}/dashboard/creator">Go to dashboard</a></p>
        <p>The Slide team</p>
      `,
    })
  } catch {
    // Email failure does not block the approve action
  }
}

export async function sendApplicationRejected({
  to,
  creatorName,
  briefTitle,
}: {
  to: string
  creatorName: string
  briefTitle: string
}) {
  try {
    await resend.emails.send({
      from: FROM,
      to,
      subject: `Update on your application`,
      html: `
        <p>Hi ${creatorName},</p>
        <p>Thank you for applying for &ldquo;<strong>${briefTitle}</strong>&rdquo;. Unfortunately the brand has decided not to progress your application at this time.</p>
        <p>Keep swiping &mdash; more briefs are coming.</p>
        <p>The Slide team</p>
      `,
    })
  } catch {
    // Email failure does not block the reject action
  }
}
