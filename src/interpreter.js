var Fact = function (name, params) {
    this.name = name;
    this.params = params;
    this.getName = function () { return this.name; }
    this.getParams = function () { return this.params; }
    this.compare = function (fact) {
		if (this.name == fact.getName()){
			let params_fact = fact.getParams();
			let is_same = (this.params.length == params_fact.length) && this.params.every( function(element, index) { return element === params_fact[index]; });
			return is_same;
		}
		return false;
    }
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
  
	var query_pattern = /(.*)\((.*)\)$/;
	var fact_pattern = /(.*)\((.*)\)\./;
	var rule_pattern = /(.*)\((.*)\) :- (.*)\./;

	this.parseDB = function (db) {
		for (i = 0; i < db.length; i++) {
			let item = db[i];
			
			if (rule_pattern.test(item)) {
				let rule = this.parseRule(item)
				db_rules.push(rule);
				
			} else if (fact_pattern.test(item)) {
				let fact = this.parseFact(item);
				db_facts.push(fact);			
			
			} else {
				throw "Error: wrong database. Line: " + item;
			}
		}
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
			if (query.compare(fact)) return true;
		}
		return false;
			
	}
	
	this.replaceRuleFactWithQueryParams = function(rule_fact, params_db, params_query){
		for (i = 0; i < params_db.length; i++){
			aux = rule_fact.replace(params_db[i], params_query[i]);
			rule_fact = aux;
		}
		return rule_fact;
		
	}
	
	this.ruleQuery = function(query) {
		let facts_result = [true];
		for (i = 0; i < db_rules.length; i++){
			let rule = db_rules[i];
			if (rule.getName() != query.getName()) continue;
			let rule_facts = rule.getFacts();
			for (j = 0; j < rule_facts.length; j++){
				let fact = rule_facts[j];
				let replaced_fact = this.replaceRuleFactWithQueryParams(fact, rule.getParams(), query.getParams());
				let new_query = this.parseQuery(replaced_fact);
				let fact_result = this.factQuery(new_query);
				facts_result.push(fact_result);
			}
		}
		if (facts_result.length == 1) return false;
		return facts_result.reduce( function(a, b) { return a * b; } );			
	}
		
	this.checkQuery = function (query) {
		if (! this.validQuery(query)) { throw "Error: wrong query." }
		let q = this.parseQuery(query);
		if (this.factQuery(q)) return true;
		else if (this.ruleQuery(q)) return true;
		return false;
	}

}

module.exports = Interpreter;
