var Interpreter = function () {
  
	var Fact = function (name, params) {
	    this.name = name;
	    this.params = params;
	    this.getName = function () { return this.name; }
	    this.getParams = function () { return this.params; }
	}

	var Rule = function (name, params, facts) {
	    this.name = name;
	    this.params = params;
	    this.facts = facts;
	    this.getName = function () { return this.name; }
	    this.getParams = function () { return this.params; }
	    this.getFacts = function () { return this.facts; }
	}
  
	var db_facts = [];
	var db_rules = [];
  
	var fact_pattern = /(.*)\((.*)\)\./;
	var rule_pattern = /(.*)\((.*)\) :- (.*)\./;

	this.parseDB = function (db) {
		let count = 0;
		for (i = 0; i < db.length; i++) {
			let item = db[i];
			if (rule_pattern.test(item) ) {
				this.parseRule(item)
				count++;
			} else if (fact_pattern.test(item) ) {
				this.parseFact(item);
				count++;			
			} else {
				alert(item);
			}
		}
		if (count != db.length) {console.log("Error in the DB."); return null;}
		else database = db;
	}
	
	this.parseFact = function (fact_str) {
		let result = fact_str.match(fact_pattern);
		let fact = new Fact(result[1], result[2].split(/,\s/));
		db_facts.push(fact);
	}
	
	this.parseRule = function (rule_str) {
		let result = rule_str.match(rule_pattern);
		let rule_facts = result[3].replace(/\),/, '\)-')
		let rule = new Rule(result[1], result[2].split(/,\s/), rule_facts.split(/-\s/));
		db_rules.push(rule);
	}

	this.checkQuery = function (query) {
		//return database[0];
		return true;
	}

}

module.exports = Interpreter;
