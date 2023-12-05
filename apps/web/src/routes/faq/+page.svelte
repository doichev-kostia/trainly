<script lang="ts">
	import Typography from "~/components/Typography.svelte";
</script>

<section class="container py-8">
	<div class="prose !text-foreground">
		<Typography component="h1">Frequently Asked Questions (FAQ)</Typography>

		<Typography id="booking" component="h2">Booking</Typography>
		<Typography component="p">
			<strong>Q: How do I book a train ticket on Trainly?</strong><br />
			A: Booking a train ticket is easy. Simply search for your destination, select your travel dates, choose your
			preferred train and seat, and proceed to checkout.
		</Typography>
		<Typography component="p">
			<strong>Q: Can I change my booking after purchase?</strong><br />
			A: Yes, you can modify your booking up to 24 hours before departure. Additional charges may apply depending on
			the fare conditions.
		</Typography>

		<Typography id="payment" component="h2">Payment</Typography>
		<Typography component="p">
			<strong>Q: What payment methods are accepted?</strong><br />
			A: We accept various payment methods including credit/debit cards, PayPal, and direct bank transfers.
		</Typography>
		<Typography component="p">
			<strong>Q: Is my payment information secure?</strong><br />
			A: Absolutely. We use industry-standard encryption to protect all your payment details for a secure transaction.
		</Typography>

		<Typography id="privacy" component="h2">Privacy Policy</Typography>
		<Typography component="p">
			<strong>Q: How does Trainly use my personal information?</strong><br />
			A: We use your information to process bookings, provide customer service, and improve our services. We do not
			sell your data to third parties.
		</Typography>
		<Typography component="p">
			<strong>Q: Can I opt out of marketing communications?</strong><br />
			A: Yes, you can unsubscribe from our marketing communications at any time via the link provided in our emails
			or by updating your preferences in your account settings.
		</Typography>
	</div>
</section>
