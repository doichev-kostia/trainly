<script lang="ts">
	import { dateFormatter, timeFormatter } from "~/routes/route/[routeId]/utils.js";
	import Typography from "~/components/Typography.svelte";

	export let startDate: Date;
	export let endDate: Date;
	export let origin: string;
	export let destination: string;
</script>

<div class="p-3 text-muted-foreground bg-muted rounded-md shadow-sm">
	<time class="mb-1 block">{dateFormatter.format(startDate)}</time>
	<div class="flex location">
		<div class="relative w-4">
			<div class="divider">
			</div>
		</div>
		<div class="flex-1 text-lg">
			<div>
				<time class="font-semibold">{timeFormatter.format(startDate)}</time>
				<Typography component="span">
					{origin}
				</Typography>
			</div>
			<div class="buffer" />
			<div>
				<time class="font-semibold">{timeFormatter.format(endDate)}</time>
				<Typography component="span">
					{destination}
				</Typography>
			</div>
		</div>
	</div>
</div>

<style lang="postcss">
    .location {
        --buffer-height: 0.5rem;
    }

    .buffer {
        height: var(--buffer-height);
    }

    .divider {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        bottom: 0;
        left: 0.25rem;
        display: block;
        width: 0.2rem;
        background-color: theme(colors.muted.foreground);
        z-index: 1;
        height: calc(var(--buffer-height) + 50%);
    }

    .divider::before {
        content: "";
        position: absolute;
        width: 8px;
        height: 8px;
        background-color: theme(colors.muted.foreground);
        top: -2%;
        left: 50%;
        transform: translateX(-50%);
        border-radius: 50%;
    }

    .divider::after {
        content: "";
        position: absolute;
        width: 8px;
        height: 8px;
        background-color: theme(colors.muted.foreground);
        bottom: -2%;
        left: 50%;
        transform: translateX(-50%);
        border-radius: 50%;
    }
</style>
