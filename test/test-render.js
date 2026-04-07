/*\
title: $:/plugins/rimir/components/test/test-render
type: application/javascript
tags: [[$:/tags/test-spec]]

Tests for components plugin rendering: pills, vtabs, menu core.

\*/
"use strict";

describe("components: pills rendering", function() {

	var wiki;

	beforeEach(function() {
		wiki = $tw.wiki;
	});

	function render(wikitext) {
		return wiki.renderText("text/html", "text/vnd.tiddlywiki", wikitext);
	}

	it("should render wrapper div with rrc-pills class", function() {
		var html = render('<$transclude $tiddler="$:/plugins/rimir/components/pills" elements="a b c"/>');
		expect(html).toContain('class="rrc-pills"');
	});

	it("should render correct number of rrc-elem spans", function() {
		var html = render('<$transclude $tiddler="$:/plugins/rimir/components/pills" elements="alpha beta gamma"/>');
		var matches = html.match(/class="rrc-elem/g);
		expect(matches).not.toBeNull();
		expect(matches.length).toBe(3);
	});

	it("should set data-elem attribute to element value", function() {
		var html = render('<$transclude $tiddler="$:/plugins/rimir/components/pills" elements="alpha beta gamma"/>');
		expect(html).toContain('data-elem="alpha"');
		expect(html).toContain('data-elem="beta"');
		expect(html).toContain('data-elem="gamma"');
	});

	it("should set data-elem-type to selector for normal elements", function() {
		var html = render('<$transclude $tiddler="$:/plugins/rimir/components/pills" elements="a b"/>');
		expect(html).toContain('data-elem-type="selector"');
	});

	it("should render element text inside span", function() {
		var html = render('<$transclude $tiddler="$:/plugins/rimir/components/pills" elements="alpha beta"/>');
		expect(html).toContain('>alpha</span>');
		expect(html).toContain('>beta</span>');
	});

	it("should render empty component with no elements", function() {
		var html = render('<$transclude $tiddler="$:/plugins/rimir/components/pills" elements=""/>');
		expect(html).toContain('class="rrc-pills"');
		expect(html).toContain('class="rrc-component"');
		var matches = html.match(/class="rrc-elem/g);
		expect(matches).toBeNull();
	});

	it("should render single element", function() {
		var html = render('<$transclude $tiddler="$:/plugins/rimir/components/pills" elements="solo"/>');
		var matches = html.match(/class="rrc-elem/g);
		expect(matches.length).toBe(1);
		expect(html).toContain('data-elem="solo"');
	});

	it("should render rrc-component wrapper inside eventcatcher", function() {
		var html = render('<$transclude $tiddler="$:/plugins/rimir/components/pills" elements="a"/>');
		expect(html).toContain('class="rrc-component"');
	});

	it("should add filter element when filterable=yes", function() {
		var html = render('<$transclude $tiddler="$:/plugins/rimir/components/pills" elements="a b" filterable="yes"/>');
		expect(html).toContain('data-elem="__f"');
		expect(html).toContain('data-elem-type="filter"');
		// Still has the regular elements
		expect(html).toContain('data-elem="a"');
		expect(html).toContain('data-elem="b"');
	});

	it("should render inline filter input when filterable=inline", function() {
		var html = render('<$transclude $tiddler="$:/plugins/rimir/components/pills" elements="a b" filterable="inline"/>');
		expect(html).toContain('class="rrc-pills-inline-filter"');
		expect(html).toContain('placeholder="Filter..."');
		// Regular elements still render
		expect(html).toContain('data-elem="a"');
	});

	it("should not add filter element when filterable is not set", function() {
		var html = render('<$transclude $tiddler="$:/plugins/rimir/components/pills" elements="a b"/>');
		expect(html).not.toContain('data-elem="__f"');
		expect(html).not.toContain('rrc-pills-inline-filter');
	});

	it("should handle many elements", function() {
		var html = render('<$transclude $tiddler="$:/plugins/rimir/components/pills" elements="a b c d e f g h i j"/>');
		var matches = html.match(/class="rrc-elem/g);
		expect(matches.length).toBe(10);
	});
});

describe("components: vtabs rendering", function() {

	var wiki;

	beforeEach(function() {
		wiki = $tw.wiki;
	});

	function render(wikitext) {
		return wiki.renderText("text/html", "text/vnd.tiddlywiki", wikitext);
	}

	it("should render wrapper div with rrc-vtabs class", function() {
		var html = render('<$transclude $tiddler="$:/plugins/rimir/components/vtabs" elements="a b"/>');
		expect(html).toContain('class="rrc-vtabs"');
	});

	it("should render elements with type from type-fn", function() {
		var html = render('<$transclude $tiddler="$:/plugins/rimir/components/vtabs" elements="sec1 act1 lnk1" type-fn="[<element>prefix[sec]then[sec]]~[<element>prefix[act]then[act]]~[<element>prefix[lnk]then[lnk]]"/>');
		expect(html).toContain('data-elem-type="sec"');
		expect(html).toContain('data-elem-type="act"');
		expect(html).toContain('data-elem-type="lnk"');
	});

	it("should set data-elem to element value", function() {
		var html = render('<$transclude $tiddler="$:/plugins/rimir/components/vtabs" elements="sec1 act1" type-fn="[<element>prefix[sec]then[sec]]~[<element>prefix[act]then[act]]"/>');
		expect(html).toContain('data-elem="sec1"');
		expect(html).toContain('data-elem="act1"');
	});

	it("should apply rrc-type-sec class to section elements", function() {
		var html = render('<$transclude $tiddler="$:/plugins/rimir/components/vtabs" elements="sec1" type-fn="[<element>prefix[sec]then[sec]]"/>');
		expect(html).toContain('rrc-type-sec');
	});

	it("should apply rrc-type-act class to action elements", function() {
		var html = render('<$transclude $tiddler="$:/plugins/rimir/components/vtabs" elements="act1" type-fn="[<element>prefix[act]then[act]]"/>');
		expect(html).toContain('rrc-type-act');
	});

	it("should always show sec elements (visible-types includes sec)", function() {
		var html = render('<$transclude $tiddler="$:/plugins/rimir/components/vtabs" elements="sec1 act1" type-fn="[<element>prefix[sec]then[sec]]~[<element>prefix[act]then[act]]" default-collapsed="yes"/>');
		expect(html).toContain('data-elem="sec1"');
	});

	it("should render sub-elements under sections when default-collapsed=no", function() {
		var html = render('<$transclude $tiddler="$:/plugins/rimir/components/vtabs" elements="sec1 act1 act2" type-fn="[<element>prefix[sec]then[sec]]~[<element>prefix[act]then[act]]" default-collapsed="no"/>');
		expect(html).toContain('data-elem="act1"');
		expect(html).toContain('data-elem="act2"');
	});

	it("should render all elements when default-collapsed=yes in headless mode", function() {
		// Note: collapse/expand is stateful (uses qualify + state tiddlers)
		// In headless renderText, qualify context differs — elements render regardless
		// Interactive collapse is tested via Playwright
		var html = render('<$transclude $tiddler="$:/plugins/rimir/components/vtabs" elements="sec1 act1 act2" type-fn="[<element>prefix[sec]then[sec]]~[<element>prefix[act]then[act]]" default-collapsed="yes"/>');
		expect(html).toContain('data-elem="sec1"');
		expect(html).toContain('data-elem-type="sec"');
	});

	it("should render empty component with no elements", function() {
		var html = render('<$transclude $tiddler="$:/plugins/rimir/components/vtabs" elements=""/>');
		expect(html).toContain('class="rrc-vtabs"');
		var matches = html.match(/class="rrc-elem/g);
		expect(matches).toBeNull();
	});

	it("should render elements without type-fn as default type", function() {
		var html = render('<$transclude $tiddler="$:/plugins/rimir/components/vtabs" elements="foo bar"/>');
		expect(html).toContain('data-elem="foo"');
		expect(html).toContain('data-elem="bar"');
	});
});

describe("components: delegate mixins", function() {

	var wiki;

	beforeEach(function() {
		wiki = $tw.wiki;
	});

	function render(wikitext) {
		return wiki.renderText("text/html", "text/vnd.tiddlywiki", wikitext);
	}

	it("should render view delegate text for selector elements in pills", function() {
		var html = render('<$transclude $tiddler="$:/plugins/rimir/components/pills" elements="hello world"/>');
		expect(html).toContain(">hello</span>");
		expect(html).toContain(">world</span>");
	});

	it("should render filter element with down-arrow SVG in pills", function() {
		var html = render('<$transclude $tiddler="$:/plugins/rimir/components/pills" elements="a" filterable="yes"/>');
		expect(html).toContain("tc-image-down-arrow");
	});

	it("should apply selected class when sync-tiddler has matching value", function() {
		// Set up a state tiddler with a selected value
		wiki.addTiddler({title: "$:/temp/test-components-sync", text: "alpha gamma"});
		var html = render('<$transclude $tiddler="$:/plugins/rimir/components/pills" elements="alpha beta gamma" selection="multi" sync-tiddler="$:/temp/test-components-sync"/>');
		// alpha and gamma should have "selected" class, beta should not
		var alphaMatch = html.match(/data-elem="alpha"[^>]*data-elem-type="selector">alpha/);
		expect(alphaMatch).not.toBeNull();
		// Check the class attribute for alpha contains "selected"
		var alphaSpan = html.match(/<span[^>]*data-elem="alpha"[^>]*/);
		expect(alphaSpan).not.toBeNull();
		expect(alphaSpan[0]).toContain("selected");
		// beta should NOT have selected
		var betaSpan = html.match(/<span[^>]*data-elem="beta"[^>]*/);
		expect(betaSpan).not.toBeNull();
		expect(betaSpan[0]).not.toContain("selected");
		// Clean up
		wiki.deleteTiddler("$:/temp/test-components-sync");
	});
});
