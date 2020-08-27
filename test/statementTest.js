const test = require('ava');
const {statement} = require('../src/statement');

const plays = {
  'hamlet': {
    'name': 'Hamlet',
    'type': 'tragedy',
  },
  'as-like': {
    'name': 'As You Like It',
    'type': 'comedy',
  },
  'othello': {
    'name': 'Othello',
    'type': 'tragedy',
  },
};

test('Customer BigCo has three performances and the audience is add more than 30 ', t => {
  //given
  const invoice = {
    'customer': 'BigCo',
    'performances': [
      {
        'playID': 'hamlet',
        'audience': 55,
      },
      {
        'playID': 'as-like',
        'audience': 35,
      },
      {
        'playID': 'othello',
        'audience': 40,
      },
    ],
  };

  const expect =  "Statement for BigCo\n" +
  " Hamlet: $650.00 (55 seats)\n" + 
  " As You Like It: $580.00 (35 seats)\n" +
  " Othello: $500.00 (40 seats)\n" + 
  "Amount owed is $1,730.00\n" +
  "You earned 47 credits \n";

  //when
  const result = statement(invoice, plays);

  //then
  t.is(result, expect);
});

test('Customer BigCo has one performance Hamlet and the audience is 55', t => {
  //given
  const invoice = {
    'customer': 'BigCo',
    'performances': [
      {
        'playID': 'hamlet',
        'audience': 55,
      }
    ],
  };

  const expect =  "Statement for BigCo\n" +
  " Hamlet: $650.00 (55 seats)\n" + 
  "Amount owed is $650.00\n" +
  "You earned 25 credits \n";

  //when
  const result = statement(invoice, plays);

  //then
  t.is(result, expect);
});

test('Customer BigCo has one performance Hamlet and the audience is 25', t => {
  //given
  const invoice = {
    'customer': 'BigCo',
    'performances': [
      {
        'playID': 'hamlet',
        'audience': 25,
      }
    ],
  };

  const expect =  "Statement for BigCo\n" +
  " Hamlet: $400.00 (25 seats)\n" + 
  "Amount owed is $400.00\n" +
  "You earned 0 credits \n";

  //when
  const result = statement(invoice, plays);

  //then
  t.is(result, expect);
});

test('Customer BigCo has one performance As You Like It and the audience is 25', t => {
  //given
  const invoice = {
    'customer': 'BigCo',
    'performances': [
      {
        'playID': 'as-like',
        'audience': 25,
      }
    ],
  };

  const expect =  "Statement for BigCo\n" +
  " As You Like It: $500.00 (25 seats)\n" + 
  "Amount owed is $500.00\n" +
  "You earned 5 credits \n";

  //when
  const result = statement(invoice, plays);

  //then
  t.is(result, expect);
});

test('Customer BigCo has one performance As You Like It and the audience is 20', t => {
  //given
  const invoice = {
    'customer': 'BigCo',
    'performances': [
      {
        'playID': 'as-like',
        'audience': 20,
      }
    ],
  };

  const expect =  "Statement for BigCo\n" +
  " As You Like It: $360.00 (20 seats)\n" + 
  "Amount owed is $360.00\n" +
  "You earned 4 credits \n";

  //when
  const result = statement(invoice, plays);

  //then
  t.is(result, expect);
});

test('Customer BigCo has other type performance', t => {
  //given
  const plays = {
    'other-type': {
      'name': 'Other Type',
      'type': 'otherType',
    },
  };
  const invoice = {
    'customer': 'BigCo',
    'performances': [
      {
        'playID': 'other-type',
        'audience': 20,
      }
    ],
  };

  //when
  try {
    statement(invoice, plays);
    t.fail();
  } catch(e) {
    t.is(e.message, 'unknown type: otherType')
  }
});

test('Customer BigCo without performance. ', t => {
  const invoice = {
    'customer': 'BigCo',
    'performances': [],
  };

  const result = statement(invoice, plays);

  t.is(result, 'Statement for BigCo\nAmount owed is $0.00\nYou earned 0 credits \n');
});

test('html render: Customer BigCo has three performances and the audience is add more than 30 ', t => {
  //given
  const invoice = {
    'customer': 'BigCo',
    'performances': [
      {
        'playID': 'hamlet',
        'audience': 55,
      },
      {
        'playID': 'as-like',
        'audience': 35,
      },
      {
        'playID': 'othello',
        'audience': 40,
      },
    ],
  };

  //when
  const result = statementHtml(invoice, plays);

  t.is(result, '<h1>Statement for BigCo</h1>\n' +
    '<table>\n' +
    '<tr><th>play</th><th>seats</th><th>cost</th></tr>' +
    ' <tr><td>Hamlet</td><td>55</td><td>$650.00</td></tr>\n' +
    ' <tr><td>As You Like It</td><td>35</td><td>$580.00</td></tr>\n' +
    ' <tr><td>Othello</td><td>40</td><td>$500.00</td></tr>\n' +
    '</table>\n' +
    '<p>Amount owed is <em>$1,730.00</em></p>\n' +
    '<p>You earned <em>47</em> credits</p>\n');

});
