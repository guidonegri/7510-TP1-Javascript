var expect = require("chai").expect;
var should = require('should');
var assert = require('assert');

var Interpreter = require('../src/interpreter');


describe("Interpreter", function () {

    var db = [
        "varon(juan).",
        "varon(pepe).",
        "varon(hector).",
        "varon(roberto).",
        "varon(alejandro).",
        "mujer(maria).",
        "mujer(cecilia).",
        "padre(juan, pepe).",
        "padre(juan, pepa).",
        "padre(hector, maria).",
        "padre(roberto, alejandro).",
        "padre(roberto, cecilia).",
        "hijo(X, Y) :- varon(X), padre(Y, X).",
        "hija(X, Y) :- mujer(X), padre(Y, X)."
    ];

    var interpreter = null;

    before(function () {
        // runs before all tests in this block
    });

    after(function () {
        // runs after all tests in this block
    });

    beforeEach(function () {
        // runs before each test in this block
        interpreter = new Interpreter();
        interpreter.parseDB(db);
    });

    afterEach(function () {
        // runs after each test in this block
    });


    describe('Parse DB', function () {

        it('db_facts length should be 12', function () {
            assert(interpreter.getFacts().length == 12);
        });

        it('db_rules length should be 2', function () {
            assert(interpreter.getRules().length == 2);
        });

        it('db_facts first item should be "varon(juan)"', function () {
        	let fact = interpreter.getFacts()[0]; 
            assert(fact.getName() == "varon");
            assert(fact.getParams()[0] == "juan");
        });

        it('db_rules first item should be "hijo(X, Y)"', function () {
        	let rule = interpreter.getRules()[0]; 
            assert(rule.getName() == "hijo");
            assert(rule.getParams()[0] == "X");
            assert(rule.getParams()[1] == "Y");
        });
               
    });
    
    describe('Parse Fact', function () {

        it('parse "varon(pepe)" should be name = varon, param = pepe', function () {
        	let fact = interpreter.parseFact("varon(pepe)."); 
            assert(fact.getName() == "varon");
            assert(fact.getParams()[0] == "pepe");
        });
        
        it('parse "padre(pepe, jose)" should be name = padre, params = pepe, jose', function () {
        	let fact = interpreter.parseFact("padre(pepe, jose)."); 
            assert(fact.getName() == "padre");
            assert(fact.getParams()[0] == "pepe");
            assert(fact.getParams()[1] == "jose");
        });
               
    });
    
    describe('Parse Rule', function () {

        it('parse "hijo(X, Y) :- varon(X), padre(Y, X)." should be name = hijo, params = X, Y, facts = varon(X), padre(Y, X)', function () {
        	let rule = interpreter.parseRule("hijo(X, Y) :- varon(X), padre(Y, X)."); 
            assert(rule.getName() == "hijo");
            assert(rule.getParams()[0] == "X");
            assert(rule.getParams()[1] == "Y");
            assert(rule.getFacts()[0] == "varon(X)");
            assert(rule.getFacts()[1] == "padre(Y, X)");
        });
        
        it('parse "subtract(X, Y, Z) :- add(Y, Z, X)." should be name = subtract, params = X, Y, Z, facts = add(Y, Z, X)', function () {
        	let rule = interpreter.parseRule("subtract(X, Y, Z) :- add(Y, Z, X)."); 
            assert(rule.getName() == "subtract");
            assert(rule.getParams()[0] == "X");
            assert(rule.getParams()[1] == "Y");
            assert(rule.getParams()[2] == "Z");
            assert(rule.getFacts()[0] == "add(Y, Z, X)");
        });
               
    });
    
    describe('Valid querys', function () {

        it('"varon(juan)" should be true', function () {
            assert(interpreter.validQuery("varon(juan)"));
        });
        
        it('"padre(roberto, cecilia)" should be true', function () {
            assert(interpreter.validQuery("padre(roberto, cecilia)"));
        });
        
        it('"hijo(roberto, pedro)" should be true', function () {
            assert(interpreter.validQuery("hijo(roberto, pedro)"));
        });

        it('"varon" should be false', function () {
            assert(interpreter.validQuery("varon") == false);
        });
        
        it('"varon(juan) varon" should be false', function () {
            assert(interpreter.validQuery("varon(juan) varon") == false);
        });
               
    });
    
    describe('Replace rule facts with query params', function () {

        it('"varon(X)" should be "varon(juan)', function () {
            assert(interpreter.replaceRuleFactWithQueryParams("varon(X)", ["X", "Y"], ["juan", "pepe"]) == "varon(juan)");
        });
        
        it('"padre(Y, X)" should be "padre(pepe, juan)', function () {
            assert(interpreter.replaceRuleFactWithQueryParams("padre(Y, X)", ["X", "Y"], ["juan", "pepe"]) == "padre(pepe, juan)");
        });
               
    });


});


