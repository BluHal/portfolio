<script lang="ts">
</script>

<div class="w-full p-[2px] task-bar bg-windows-grey fixed bottom-0 left-0 right-0 z-50">
	<button class="start-button-wrapper">
		<div
			class="bg-no-repeat w-[45px] h-[14px]"
			style="background-image: url(/icons/start-button.png);"
		></div>
	</button>
</div>

<style>
	.task-bar {
		box-shadow: inset 1px 0 #fff;
		border-top: 1px solid #f4f4f4;
		border-bottom: 1px solid #4e4e4e;
	}

	.start-button-wrapper {
		float: left;
		margin-left: 2px;
		margin-bottom: 2px;
		vertical-align: middle;
		display: inline-block;
		padding: 2px 6px 3px;
		background-color: silver;
		border-top: 1px solid #fff;
		border-left: 1px solid #fff;
		border-right: 1px solid gray;
		border-bottom: 1px solid gray;
		box-shadow:
			inset 1px 1px #dfdfdf,
			1px 0 #000,
			0 1px #000,
			1px 1px #000;
		min-width: 59px;
		margin-right: 6px;
		color: #000;
	}
</style>
