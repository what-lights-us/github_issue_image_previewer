const previewer_class = "image_preview"
const ticket_class = "board-view-column-card"

const regex_match_issue_url = /^https:\/\/github\.com\/(.*)\/(.*)\/issues\/(\d+)$/
const regex_match_image_url = /\((https:\/\/github.com\/.*\/assets\/.*)\)/

document.addEventListener('DOMContentLoaded', function(e) {
	find_html_tickets()
})
document.addEventListener('readstatechange', function(e) {
	find_html_tickets()
})
find_html_tickets()
setTimeout(find_html_tickets, 5000)

function find_html_tickets() {
	var html_tickets = document.getElementsByClassName(ticket_class);
	var memex_id = JSON.parse(document.getElementById("memex-data").innerText).id
	var memex_data = JSON.parse(document.getElementById("memex-items-data").innerText)
	for (let i = 0; i < html_tickets.length; i++) { 
		let html_ticket = html_tickets[i]
		let html_id = html_ticket.attributes.getNamedItem("data-board-card-id").value
		let has_preview = html_ticket.getElementsByClassName(previewer_class).length > 0
		if (has_preview) {
			continue
		}
		parse_memex(
			html_ticket, 
			memex_id, 
			memex_data.find(memex_datum => memex_datum.id == html_id),
		)
	}
}

function parse_memex(html_ticket, memex_id, memex_data) {
	var memex_params = `kind=issue&item_id=${memex_data.contentId}&repository_id=${memex_data.contentRepositoryId}&omit_comments=false&omit_capabilities=false`
	var memex_url = `https://github.com/memexes/${memex_id}/side_panel_item?${memex_params}`
	const response = fetch(
		memex_url,
		{
			method: "GET",
			headers: {
				Accept: "application/json",
			},
		},
	)
	response
		.then(data => {
			data.json()
				.then(response_body => {
					let issue_body = response_body.description.body
					let image_url_matches = issue_body.match(regex_match_image_url)
					let image_href = image_url_matches[1]
					update_issue(html_ticket, image_href)
				})
				.catch(console.error)
		})
		.catch(console.error)
}

function update_issue(html_ticket, image_href) {
	let image_html = document.createElement("img")
	image_html.src = image_href
	image_html.style.maxWidth = "100%"
	image_html.className = previewer_class
	html_ticket.appendChild(image_html)
}
