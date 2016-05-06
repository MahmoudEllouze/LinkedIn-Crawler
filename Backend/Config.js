var checkers = [
	{
		name: 'experience',
		state: true,
		selectors: "#background-experience .editable-item.section-item",
		fields: [{
			title: "h4",
			company: "h5",
			date : "span",
			description: "p"
		}]
	},{
		name : 'email',
		state : true,
		selectors : '#email',
		fields : 'a'
	},
	{
		name: 'skills',
		state: true,
		selectors: ".skill-pill",
		fields: [{
			number: ".num-endorsements@data-count",
			title: ".endorse-item-name-text@text"
		}]
	}, {
		name: 'recommendation',
		state: true, 
		selectors: ".endorsement-info",
		fields: [{
			recommender: "h5",
			position: "h6",
			description: "p"
		}]
	}, {
		name: 'education',
		state: true,
		selectors: ".education",
		fields: [{
			title: "h4",
			diploma: "h5",
			date: ".education-date"
		}]
	}, {
		name: 'language',
		state: true,
		selectors: "#languages-view  li.section-item",
		fields: ["h4"]
	}, {
		name: 'interest',
		state: true,
		selectors: ".interests-listing li",
		fields: ["a"]
	}, {
		name: 'consultedpeople',
		state: true,
		selectors: ".insights-browse-map li",
		fields: [{
			title: "h4",
			adress: "a@href"

		}]
	}, {
		name: 'url',
		state: true,
		selectors: ".profile-actions ",
		fields: ".view-public-profile"

	},{
		name : 'identifier',
		state : true,
		selectors : "#name-container",
		fields : "h1"
	}
	];
	module.exports = checkers;
