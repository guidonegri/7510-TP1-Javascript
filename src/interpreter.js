var Fact = function (name, params) {
    this.name = name;
    this.params = params;
    this.getName = function () { return this.name; }
    this.getParams = function () { return this.params; }
    this.getParamsCount = function () { return this.params.lenght; }
}

var Rule = function (name, params, facts) {
    this.name = name;
    this.params = params;
    this.facts = facts;
    this.getName = function () { return this.name; }
    this.getParams = function () { return this.params; }
    this.getFacts = function () { return this.facts; }
}

var Interpreter = function () { 
	var db_facts = [];
	var db_rules = [];
  
	//var query_pattern = /(.*)\(([A-Za-z0-9, ]){1,}\)/;
	var query_pattern = /(.*)\((.*)\)/;
	var fact_pattern = /(.*)\((.*)\)\./;
	var rule_pattern = /(.*)\((.*)\) :- (.*)\./;

	this.parseDB = function (db) {
		let count = 0;
		for (i = 0; i < db.length; i++) {
			let item = db[i];
			
			if (rule_pattern.test(item) ) {
				let rule = this.parseRule(item)
				db_rules.push(rule);
				count++;
			
			} else if (fact_pattern.test(item) ) {
				let fact = this.parseFact(item);
				db_facts.push(fact);
				count++;			
			
			} else {
				alert(item);
			}
		}
		if (count != db.length) {console.log("Error in the DB."); return null;}
	}
	
	this.parseFact = function (fact_str) {
		let result = fact_str.match(fact_pattern);
		let fact = new Fact(result[1], result[2].split(/,\s/));
		return fact;
	}
		
	this.parseRule = function (rule_str) {
		let result = rule_str.match(rule_pattern);
		let rule_facts = result[3].replace(/\),/, '\)-')
		let rule = new Rule(result[1], result[2].split(/,\s/), rule_facts.split(/-\s/));
		return rule;
	}
	
	this.parseQuery = function (query_str) {
		let result = query_str.match(query_pattern);
		let query = new Fact(result[1], result[2].split(/,\s/));
		return query;
	}

	this.validQuery = function (query) {
		  return (query_pattern.test(query))
		}
	
	this.factQuery = function(query) {
			for (i = 0; i < db_facts.length; i++){
				let fact = db_facts[i];
				if (query.getName() == fact.getName()){
					let params_query = query.getParams();
					let params_fact = fact.getParams();
					let is_same = (params_query.length == params_fact.length) && params_query.every( function(element, index) { return element === params_fact[index]; });
					if (is_same) return true;
				}
			}
			return false;
			
		}
		
	this.checkQuery = function (query) {
		if (! this.validQuery(query)) { return null; }
		let q = this.parseQuery(query);
		if (this.factQuery(q)) {return true}
		return false;
	}

}

module.exports = Interpreter;
