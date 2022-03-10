/// <reference types="cypress" />
/// <reference types="../support" />
// @ts-check

describe('TodoMVC', function () {
    // setup these constants to match what TodoMVC does
    let TODO_ITEM_ONE = 'buy some cheese'
    let TODO_ITEM_TWO = 'feed the cat'
    let TODO_ITEM_THREE = 'book a doctors appointment'    
    let TODO_ITEM_FOUR = 'take a walk'
    let TODO_ITEM_FIVE = 'ride your bike'
    let TODO_ITEM_SIX = 'go to the gym'
    let TODO_ITEM_SEVEN = 'visit post office'
    let TODO_ITEM_EIGHT = 'clean car'
    let TODO_ITEM_NINE = 'research electric vehicles'
    let TODO_ITEM_TEN = 'water plants'
    let TODO_ITEM_ELEVEN = 'check email'
    let TODO_ITEM_TWELVE = 'do yoga for fifteen minutes'
  
    beforeEach(function () {
      cy.visit('/')
    })
  
    afterEach(() => {
      cy.window().then((win) => {
        // @ts-ignore
        win.document.activeElement.blur()
      })
    })
  
    it('adds 3 todos', function () {
      cy.get('.new-todo')
      .type('schedule date night{enter}')
      .type('buy roses{enter}')
      .type('buy manicure gift certificate{enter}')
  
      cy.get('.todo-list li').should('have.length', 3)
    })
  
    context('No Todos', function () {
      it('should hide #main and #footer', function () {
        cy.get('.todo-list li').should('not.exist')
        cy.get('[data-layer="Content"]').should('not.exist')
        cy.get('.footer').should('not.be.visible')
      })
    })
  
    context('New Todo', function () {

      it('should allow me to add todo items', function () {
        cy.get('.new-todo')
        .type(TODO_ITEM_ONE)
        .type('{enter}')
  
        cy.get('.todo-list li')
        .eq(0)
        .find('label')
        .should('contain', TODO_ITEM_ONE)
  
        cy.get('.new-todo')
        .type(TODO_ITEM_TWO)
        .type('{enter}')
  
        cy.get('.todo-list li')
        .eq(1)
        .find('label')
        .should('contain', TODO_ITEM_TWO)

        cy.get('.new-todo')
        .type(TODO_ITEM_THREE)
        .type('{enter}')
  
        cy.get('.todo-list li')
        .eq(2)
        .find('label')
        .should('contain', TODO_ITEM_THREE)

        cy.get('.new-todo')
        .type(TODO_ITEM_FOUR)
        .type('{enter}')
  
        cy.get('.todo-list li')
        .eq(3)
        .find('label')
        .should('contain', TODO_ITEM_FOUR)
      })
  
      it('adds items', function () {
        // create several todos then check the number of items in the list
        cy.get('.new-todo')
        .type('todo A{enter}')
        .type('todo B{enter}') // we can continue working with same element
        .type('todo C{enter}') // and keep adding new items
        .type('todo D{enter}')
        .type('todo E{enter}')
        cy.get('.todo-list li').should('have.length', 5)
      })
  
      it('should clear text input field when an item is added', function () {
        cy.get('.new-todo')
        .type(TODO_ITEM_ONE)
        .type('{enter}')
  
        cy.get('.new-todo').should('have.text', '')
      })
  
      it('should append new items to the bottom of the list', function () {
        // this is an example of a custom command
        // defined in cypress/support/commands.js
        // @ts-ignore
        cy.createDefaultTodos().as('todos')
  
        // even though the text content is split across
        // multiple <span> and <strong> elements
        // `cy.contains` can verify this correctly
        cy.get('.todo-count').contains('3 items left')
  
        cy.get('@todos')
        .eq(0)
        .find('label')
        .should('contain', TODO_ITEM_ONE)
  
        cy.get('@todos')
        .eq(1)
        .find('label')
        .should('contain', TODO_ITEM_TWO)
  
        cy.get('@todos')
        .eq(2)
        .find('label')
        .should('contain', TODO_ITEM_THREE)
      })
  
      it('should show #main and #footer when items added', function () {
        // @ts-ignore
        cy.createTodo(TODO_ITEM_ONE)
        cy.get('.main').should('be.visible')
        cy.get('.footer').should('be.visible')
      })
    })
  
    context('Mark all as completed', function () {
  
      beforeEach(function () {
        // @ts-ignore
        cy.createDefaultTodos().as('todos')
      })
  
      it('should allow me to mark all items as completed', function () {
        cy.get('.toggle-all').check()
  
        cy.get('@todos')
        .eq(0)
        .should('have.class', 'completed')
  
        cy.get('@todos')
        .eq(1)
        .should('have.class', 'completed')
  
        cy.get('@todos')
        .eq(2)
        .should('have.class', 'completed')
      })
  
      it('should allow me to clear the complete state of all items', function () {
        cy.get('.toggle-all')
        .check()
        .uncheck()
  
        cy.get('@todos')
        .eq(0)
        .should('not.have.class', 'completed')
  
        cy.get('@todos')
        .eq(1)
        .should('not.have.class', 'completed')
  
        cy.get('@todos')
        .eq(2)
        .should('not.have.class', 'completed')
      })
  
      it('complete all checkbox should update state when items are completed / cleared', function () {
        cy.get('.toggle-all')
        .as('toggleAll')
        .check()
        .should('be.checked')
  
        cy.get('.todo-list li')
        .eq(0)
        .as('firstTodo')
        .find('.toggle')
        .uncheck()

        cy.get('@toggleAll').should('not.be.checked')
  
        cy.get('@firstTodo')
        .find('.toggle')
        .check()

        cy.get('@toggleAll').should('be.checked')
      })
    })
  
    context('Item', function () {
  
      it('should allow me to mark items as complete', function () {
        // @ts-ignore
        cy.createTodo(TODO_ITEM_ONE).as('firstTodo')
        // @ts-ignore
        cy.createTodo(TODO_ITEM_TWO).as('secondTodo')
  
        cy.get('@firstTodo')
        .find('.toggle')
        .check()
  
        cy.get('@firstTodo').should('have.class', 'completed')
  
        cy.get('@secondTodo').should('not.have.class', 'completed')
        cy.get('@secondTodo')
        .find('.toggle')
        .check()
  
        cy.get('@firstTodo').should('have.class', 'completed')
        cy.get('@secondTodo').should('have.class', 'completed')
      })
  
      it('should allow me to un-mark items as complete', function () {
        // @ts-ignore
        cy.createTodo(TODO_ITEM_ONE).as('firstTodo')
        // @ts-ignore
        cy.createTodo(TODO_ITEM_TWO).as('secondTodo')
  
        cy.get('@firstTodo')
        .find('.toggle')
        .check()
  
        cy.get('@firstTodo').should('have.class', 'completed')
        cy.get('@secondTodo').should('not.have.class', 'completed')
  
        cy.get('@firstTodo')
        .find('.toggle')
        .uncheck()
  
        cy.get('@firstTodo').should('not.have.class', 'completed')
        cy.get('@secondTodo').should('not.have.class', 'completed')
      })
  
      it('should allow me to edit an item', function () {
        // @ts-ignore
        cy.createDefaultTodos().as('todos')
  
        cy.get('@todos')
        .eq(1)
        .as('secondTodo')
        // TODO: fix this, dblclick should
        // have been issued to label
        .find('label')
        .dblclick()
  
        // clear out the inputs current value
        // and type a new value
        cy.get('@secondTodo')
        .find('.edit')
        .clear()
        .type('buy some sausages')
        .type('{enter}')
  
        // explicitly assert about the text value
        cy.get('@todos')
        .eq(0)
        .should('contain', TODO_ITEM_ONE)
  
        cy.get('@secondTodo').should('contain', 'buy some sausages')
        cy.get('@todos')
        .eq(2)
        .should('contain', TODO_ITEM_THREE)
      })
    })
  
    context('Editing', function () {

      beforeEach(function () {
        // @ts-ignore
        cy.createDefaultTodos().as('todos')
      })
  
      it('should hide other controls when editing', function () {
        cy.get('@todos')
        .eq(1)
        .as('secondTodo')
        .find('label')
        .dblclick()
  
        cy.get('@secondTodo')
        .find('.toggle')
        .should('not.be.visible')
  
        cy.get('@secondTodo')
        .find('label')
        .should('not.be.visible')
      })
  
      it('should save edits on blur', function () {
        cy.get('@todos')
        .eq(1)
        .as('secondTodo')
        .find('label')
        .dblclick()
  
        cy.get('@secondTodo')
        .find('.edit')
        .clear()
        .type('buy some sausages')
        // we can just send the blur event directly
        // to the input instead of having to click
        // on another button on the page. though you
        // could do that its just more mental work
        .blur()
  
        cy.get('@todos')
        .eq(0)
        .should('contain', TODO_ITEM_ONE)
  
        cy.get('@secondTodo').should('contain', 'buy some sausages')
        cy.get('@todos')
        .eq(2)
        .should('contain', TODO_ITEM_THREE)
      })
  
      it('should trim entered text', function () {
        cy.get('@todos')
        .eq(1)
        .as('secondTodo')
        .find('label')
        .dblclick()
  
        cy.get('@secondTodo')
        .find('.edit')
        .clear()
        .type('    buy some sausages    ')
        .type('{enter}')
  
        cy.get('@todos')
        .eq(0)
        .should('contain', TODO_ITEM_ONE)
  
        cy.get('@secondTodo').should('contain', 'buy some sausages')
        cy.get('@todos')
        .eq(2)
        .should('contain', TODO_ITEM_THREE)
      })
  
      it('should remove the item if an empty text string was entered', function () {
        cy.get('@todos')
        .eq(1)
        .as('secondTodo')
        .find('label')
        .dblclick()
  
        cy.get('@secondTodo')
        .find('.edit')
        .clear()
        .type('{enter}')
  
        cy.get('@todos').should('have.length', 2)
      })
  
      it('should cancel edits on escape', function () {
        cy.get('@todos')
        .eq(1)
        .as('secondTodo')
        .find('label')
        .dblclick()
  
        cy.get('@secondTodo')
        .find('.edit')
        .clear()
        .type('foo{esc}')
  
        cy.get('@todos')
        .eq(0)
        .should('contain', TODO_ITEM_ONE)
  
        cy.get('@todos')
        .eq(1)
        .should('contain', TODO_ITEM_TWO)
  
        cy.get('@todos')
        .eq(2)
        .should('contain', TODO_ITEM_THREE)
      })
    })
  
    context('Counter', function () {
      it('should display the current number of todo items', function () {
        // @ts-ignore
        cy.createTodo(TODO_ITEM_ONE)
        cy.get('.todo-count').contains('1 item left')
        // @ts-ignore
        cy.createTodo(TODO_ITEM_TWO)
        cy.get('.todo-count').contains('2 items left')
      })
    })
  
    context('Clear completed button', function () {
      beforeEach(function () {
        // @ts-ignore
        cy.createDefaultTodos().as('todos')
      })
  
      it('should display the correct text', function () {
        cy.get('@todos')
        .eq(0)
        .find('.toggle')
        .check()
  
        cy.get('.clear-completed').contains('Clear completed')
      })
  
      it('should remove completed items when clicked', function () {
        cy.get('@todos')
        .eq(1)
        .find('.toggle')
        .check()
  
        cy.get('.clear-completed').click()
        cy.get('@todos').should('have.length', 2)
        cy.get('@todos')
        .eq(0)
        .should('contain', TODO_ITEM_ONE)
  
        cy.get('@todos')
        .eq(1)
        .should('contain', TODO_ITEM_THREE)
      })
    })
  })
  