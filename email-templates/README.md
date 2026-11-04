# Booking form emails (EmailJS)

When a guest submits the booking form, the site sends two emails:

1. **Booking request received** to the guest (`guest-confirmation.html`). It tells them the
   reservation isn't confirmed until they call the front desk, and is subject to availability until then.
2. **New booking alert** to the motel (`motel-notification.html`)

EmailJS's free plan allows only 2 templates per account, and Sun Valley's account already uses both.
So Valley Inn needs **its own free EmailJS account**. The free plan includes 200 emails a month,
and each booking uses 2, so about 100 bookings a month.

## Setup (about 15 minutes)

1. Sign up at emailjs.com with the Valley Inn email address.
2. **Email Services → Add New Service → Gmail** (or whichever email the motel uses) and connect it.
   Copy the **Service ID**.
3. **Email Templates → Create New Template**. Name it "Guest confirmation".
   - Click **Edit Content → Code Editor** and paste everything from `guest-confirmation.html`.
   - Fill in Subject, To Email, From Name and Reply To using the values in the comment at the top of the file.
   - Save and copy the **Template ID**.
4. Create a second template named "New booking alert" the same way, using `motel-notification.html`.
   Copy its **Template ID**.
5. **Account → General**: copy the **Public Key**.
6. Paste the four values into `emailjs` in `src/data/motel.ts`:

   ```ts
   emailjs: {
     publicKey: "your public key",
     serviceId: "service_...",
     guestTemplateId: "template_...",   // Guest confirmation
     motelTemplateId: "template_...",   // New booking alert
   },
   ```

7. Save. The "Book online" and "Book this room" buttons appear on the site.
8. Test it: send a booking to your own email and check that both emails arrive.

**Recommended:** if your EmailJS account shows an allowed-domains setting under **Account → Security**,
add the site's domain there so other websites can't use your keys.

## Variables the form sends

`guest_name`, `guest_email`, `guest_phone`, `room_type`, `guests`, `checkin`, `checkout`, `nights`, `special_requests`
