/**
 * @jest-environment jsdom
 */

import { screen, fireEvent } from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import Bills from "../containers/Bills"
import { ROUTES, ROUTES_PATH } from "../constants/routes"
import { localStorageMock } from "../__mocks__/localStorage.js"

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", () => {
      const html = BillsUI({ data: []})
      document.body.innerHTML = html
      //to-do write expect expression
    })
    test("Then bills should be ordered from earliest to latest", () => {
      const html = BillsUI({ data: bills })
      document.body.innerHTML = html
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })
    test("Then should display loading page", () => {
      const html = BillsUI({ data: [], loading:true })
      document.body.innerHTML = html

      expect(screen.getAllByText("Loading...")).toBeTruthy()
    })
    test("Then should display error page", () => {
      const html = BillsUI({ data: [], error:"Mon erreur exemple" })
      document.body.innerHTML = html

      expect(screen.getByTestId('error-message')).toBeDefined()
      expect(screen.getAllByText("Mon erreur exemple")).toBeTruthy()
    })
    describe("Bills Container Unit Test Suites", () => {
      test("Should open the New Bill page when I click on new Bill button", () => {
        const html = BillsUI({ data: bills })
        document.body.innerHTML = html
        
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname })
        }
        const b = new Bills({
          document, onNavigate, firestore: null, localStorageMock
        })

        const buttonNewBill = screen.getByTestId("btn-new-bill")
        fireEvent.click(buttonNewBill)
        
        expect(screen.getAllByText("Envoyer une note de frais")).toBeTruthy()
      })
  
      test("Should open the Bill Modale when I click on eye button", () => {
        const html = BillsUI({ data: bills })
        document.body.innerHTML = html

        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname })
        }
        const b = new Bills({
          document, onNavigate, firestore: null, localStorageMock
        })
      })
    })
  })
})