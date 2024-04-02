/*
 * TODO: When to uncomment?
document.addEventListener('pjax:success',function(e){
	setupIssuePreview()
})
*/

const previewer_class = "image_preview"
const ticket_class = "board-view-column-card"

const regex_match_issue_url = /^https:\/\/github\.com\/(.*)\/(.*)\/issues\/(\d+)$/
const regex_match_image_url = "\(https:\/\/github\.com\/.*\/assets\/(.*\/.*)\)"

function find_html_tickets() {
	var html_tickets = document.getElementsByClassName(ticket_class);
	for (let i = 0; i < html_tickets.length; i++) { 
		let html_ticket = html_tickets[i]
		let html_id = html_ticket.attributes.getNamedItem("data-board-card-id")
		let has_preview = html_ticket.getElementsByClassName(previewer_class).length > 0
		if (has_preview) {
			continue
		}
		let html_anchor = html_tickets[i].getElementsByTagName("a")
		let anchor = html_anchor[0].href

		let matches = anchor.match(regex_match_issue_url)
		let match_data = {
			org: matches[1],
			project: matches[2],
			issue: +matches[3]
		}
		let image_id = fetch_image_id(match_data)

		if (!image_id) {
			continue
		}
		let image_href = `https://github.com/${match_data.org}/${match_data.project}/${image_id}`
		let image_html = `<img src=${image_href}></img>`
	}
}

function fetch_image_id(match_data) {
	// TODO: Generate UUID
	let uuid = "debcc352824446hf82aa2afe28eb33cc"
	let variables = `{"fetchSubIssues":"false","allowedOwner":"${match_data.org}","owner":"${match_data.org}","repo":"${match_data.project}","number":${match_data.issue}}`
	let graphql_body = `{"query":"${uuid}","variables":${variables}}`
	let request_url = "https://github.com/_graphql"

	let get_request = new XMLHttpRequest()
	get_request.open("GET", request_url, true)
	get_request.setRequestHeader("body", graphql_body)
	get_request.send(null)

	let issue_body = data.repository.issue.body
	let image_url_matches = issue_body.match(regex_match_image_url)
	let image_id = image_url_matches[1]
	return image_id
}


setTimeout(find_html_tickets, 1000);
