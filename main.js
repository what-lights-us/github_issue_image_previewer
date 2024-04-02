document.addEventListener('pjax:success',function(e){
	find_html_tickets()
})
setTimeout(find_html_tickets, 5000);

// data-board-column
// 	Deprioritized
// 	Blocked
// 	Todo
// 	In Progress
// 	In Review
// 	Done

const previewer_class = "image_preview"
const ticket_class = "board-view-column-card"

const regex_match_issue_url = /^https:\/\/github\.com\/(.*)\/(.*)\/issues\/(\d+)$/
const regex_match_image_url = /\((https:\/\/github.com\/.*\/assets\/.*)\)/

function find_html_tickets() {
	var html_tickets = document.getElementsByClassName(ticket_class);
	for (let i = 0; i < html_tickets.length; i++) { 
		let html_ticket = html_tickets[i]
		let html_id = html_ticket.attributes.getNamedItem("data-board-card-id")
		let has_preview = html_ticket.getElementsByClassName(previewer_class).length > 0
		if (has_preview) {
			continue
		}
		let html_anchor = html_ticket.getElementsByTagName("a")
		let anchor = html_anchor[0].href

		let matches = anchor.match(regex_match_issue_url)
		let match_data = {
			org: matches[1],
			project: matches[2],
			issue: +matches[3]
		}

		let image_id = fetch_image_id(match_data, html_ticket)
	}
}

function fetch_image_id(match_data, html_ticket) {
	let uuid = "3e7d8b42741714a534f9069588f012b8"
	let variables = `{"fetchSubIssues":false,"allowedOwner":"${match_data.org}","owner":"${match_data.org}","repo":"${match_data.project}","number":${match_data.issue}}`
	let graphql_body = `{"query":"${uuid}","variables":${variables}}`
	let request_url = `https://github.com/_graphql?body=${graphql_body}`

	const response = fetch(
		request_url,
		{
			method: "GET",
			headers: {
				Accept: "*/*",
			},
		},
	);

	response
		.then(data => {
			data.json()
				.then(response_body => {
					let issue_body = response_body.data.repository.issue.body
					let image_url_matches = issue_body.match(regex_match_image_url)
					let image_href = image_url_matches[1]
					update_issue(match_data, html_ticket, image_href)
				})
				.catch(console.error)
		})
		.catch(console.error)
}

function update_issue(match_data, html_ticket, image_href) {
	let image_html = document.createElement("img")
	image_html.src = image_href
	image_html.style.maxWidth = "100%"
	image_html.className = previewer_class
	html_ticket.appendChild(image_html)
}
