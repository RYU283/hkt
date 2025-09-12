<!-- src/routes/admin/+page.svelte -->

<script>
	export let data;
</script>

<div class="admin-layout">
	<h1 class="main-title">📊 키오스크 관리자 페이지</h1>

	<!-- 1. 요약 정보 카드 -->
	<div class="summary-grid">
		<div class="summary-card">
			<span class="card-title">총 매출</span>
			<span class="card-value">{data.totalRevenue.toLocaleString()}원</span>
		</div>
		<div class="summary-card">
			<span class="card-title">총 고객 수</span>
			<span class="card-value">{data.customers.length.toLocaleString()}명</span>
		</div>
	</div>

	<!-- 2. 데이터 테이블 -->
	<div class="tables-grid">
		<!-- 음식별 주문 통계 -->
		<div class="table-container">
			<h2 class="table-title">메뉴별 주문 수량</h2>
			<div class="table-wrapper">
				<table>
					<thead>
						<tr>
							<th>메뉴 이름</th>
							<th>총 주문 수량</th>
						</tr>
					</thead>
					<tbody>
						{#each data.orderStats as stat}
							<tr>
								<td>{stat.product_name}</td>
								<td>{stat.total_quantity.toLocaleString()}개</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>

		<!-- 고객별 포인트 현황 -->
		<div class="table-container">
			<h2 class="table-title">고객별 포인트 현황</h2>
			<div class="table-wrapper">
				<table>
					<thead>
						<tr>
							<th>전화번호</th>
							<th>보유 포인트</th>
						</tr>
					</thead>
					<tbody>
						{#each data.customers as customer}
							<tr>
								<td>{customer.phone_number}</td>
								<td>{Math.floor(customer.points).toLocaleString()} P</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</div>
</div>

<style>
	.admin-layout {
		width: 100%;
		height: 100%;
		padding: 2.5rem;
		box-sizing: border-box;
		background-color: #f8f9fa;
	}
	.main-title {
		font-size: 2.5rem;
		color: #343a40;
		margin: 0 0 2rem 0;
	}

	.summary-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 1.5rem;
		margin-bottom: 2.5rem;
	}
	.summary-card {
		background: #ffffff;
		border-radius: 16px;
		padding: 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		box-shadow: 0 4px 12px rgba(0,0,0,0.05);
	}
	.card-title {
		font-size: 1.1rem;
		color: #868e96;
		font-weight: 500;
	}
	.card-value {
		font-size: 2.2rem;
		font-weight: 700;
		color: #1c7ed6;
	}

	.tables-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 2rem;
		/* 중요: 전체 높이에서 제목과 요약 카드의 높이를 뺀 만큼 차지 */
		height: calc(100% - 160px); 
	}
	.table-container {
		background: #ffffff;
		border-radius: 16px;
		padding: 1.5rem;
		box-shadow: 0 4px 12px rgba(0,0,0,0.05);
		display: flex;
		flex-direction: column;
	}
	.table-title {
		font-size: 1.5rem;
		margin: 0 0 1rem 0;
		color: #343a40;
	}
	.table-wrapper {
		flex: 1; /* 남는 공간을 모두 차지하여 스크롤이 가능하게 함 */
		overflow-y: auto;
	}

	table {
		width: 100%;
		border-collapse: collapse;
	}
	th, td {
		padding: 0.8rem 1rem;
		text-align: left;
		border-bottom: 1px solid #f1f3f5;
	}
	thead th {
		position: sticky; /* 스크롤 시 헤더 고정 */
		top: 0;
		background: #f8f9fa;
		font-size: 0.9rem;
		color: #495057;
	}
	tbody tr:hover {
		background-color: #f8f9fa;
	}
	td:last-child {
		font-weight: 500;
		text-align: right;
	}
</style>