/**
 * @jest-environment jsdom
 */

import { screen, fireEvent } from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import Bills from "../containers/Bills"
import { ROUTES, ROUTES_PATH } from "../constants/routes"
import { localStorageMock } from "../__mocks__/localStorage.js"
import firebase from "../__mocks__/firebase"
import router from "../__mocks__/router.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", () => {
      /* It's setting user type as Employee in localStorage */
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee"
        })
      )

      /* It's rendering BillsUI in order to test icon */
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      const billsUI = BillsUI({
        bills: [],
        email: "test@example.com"
      })
      root.innerHTML = billsUI
      document.body.appendChild(root)

      /* It's defining URL to Bills using mocked rooter */
      window.location.assign(ROUTES_PATH['Bills'])
      router()

      /* It's testing if bills icon is active (highlighted) */
      const billsIcon = screen.getByTestId("icon-window")
      expect(billsIcon.classList.contains("active-icon")).toBeTruthy()
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

        const iconEye = screen.getAllByTestId("icon-eye")
        fireEvent.click(iconEye[0])
        expect(screen.getByText("Justificatif")).toBeVisible()
      })
    })
  })
})

// test d'intégration GET
describe("Given I am connected as an employee", () => {
  describe("When I navigate to Dashboard", () => {
    test("fetches bills from mock API GET", async () => {
       const getSpy = jest.spyOn(firebase, "get")
       const bills = await firebase.get()
       expect(getSpy).toHaveBeenCalledTimes(1)
       expect(bills.data.length).toBe(4)
    })
    test("fetches bills from an API and fails with 404 message error", async () => {
      firebase.get.mockImplementationOnce(() =>
        Promise.reject(new Error("Erreur 404"))
      )
      const html = BillsUI({ error: "Erreur 404" })
      document.body.innerHTML = html
      const message = await screen.getByText(/Erreur 404/)
      expect(message).toBeTruthy()
    })
    test("fetches messages from an API and fails with 500 message error", async () => {
      firebase.get.mockImplementationOnce(() =>
        Promise.reject(new Error("Erreur 500"))
      )
      const html = BillsUI({ error: "Erreur 500" })
      document.body.innerHTML = html
      const message = await screen.getByText(/Erreur 500/)
      expect(message).toBeTruthy()
    })
  })
})
