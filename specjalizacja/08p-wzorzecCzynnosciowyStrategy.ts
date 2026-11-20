/**
 * @description Kontrakt wspólny dla wymiennych algorytmów naliczania rabatu.
 * @architectural-note Zapobiega uzależnieniu kontekstu koszyka od klas konkretnych i rozrastaniu się instrukcji warunkowych.
 * @inf04-relevance Pokazuje definiowanie interfejsu oraz polimorficzne wywoływanie metod w TypeScript.
 */
interface IDiscountStrategy {
	/**
	 * @description Zwraca cenę po zastosowaniu rabatu do podanej kwoty.
	 * @architectural-note Ujednolica wejście i wyjście wszystkich algorytmów rabatowych.
	 * @inf04-relevance Uczeń ćwiczy typowanie sygnatur metod oraz delegowanie odpowiedzialności.
	 */
	applyDiscount(totalAmount: number): number;
}

/**
 * @description Implementuje rabat procentowy skonfigurowany w konstruktorze.
 * @architectural-note Kapsułkuje algorytm procentowy poza klasą kontekstu.
 * @inf04-relevance Jest przykładem konkretnej strategii implementującej interfejs.
 */
class PercentageDiscount implements IDiscountStrategy {
	/** @description Wartość rabatu procentowego. */
	private readonly percentage: number;

	/**
	 * @description Tworzy strategię procentową i sprawdza poprawność konfiguracji.
	 * @architectural-note Odrzuca nieprawidłową konfigurację na granicy obiektu zamiast ukrywać błąd w kalkulacji.
	 * @inf04-relevance Pokazuje walidację argumentów konstruktora i modyfikator readonly.
	 */
	public constructor(percentage: number) {
		if (!Number.isFinite(percentage) || percentage < 0 || percentage > 100) {
			throw new RangeError("Procent rabatu musi należeć do przedziału od 0 do 100.");
		}
		this.percentage = percentage;
	}

	/**
	 * @description Oblicza kwotę po odjęciu rabatu procentowego.
	 * @architectural-note Strategia zawiera wyłącznie własną regułę biznesową i nie zarządza koszykiem.
	 * @inf04-relevance Uczeń widzi realizację wspólnego kontraktu przez niezależny algorytm.
	 */
	public applyDiscount(totalAmount: number): number {
		validateNonNegativeAmount(totalAmount, "Wartość koszyka");
		return roundCurrency(totalAmount * (1 - this.percentage / 100));
	}
}

/**
 * @description Implementuje rabat o stałą kwotę i nigdy nie zwraca ujemnej ceny.
 * @architectural-note Reguła ograniczenia ceny jest lokalna dla algorytmu, nie zaś rozproszona po klientach.
 * @inf04-relevance Demonstruje zabezpieczenie wyniku i testowalność konkretnej strategii.
 */
class FixedAmountDiscount implements IDiscountStrategy {
	/** @description Kwota odejmowana od wartości koszyka. */
	private readonly discountAmount: number;

	/**
	 * @description Tworzy strategię stałego rabatu z nieujemną kwotą.
	 * @architectural-note Nie dopuszcza błędnej konfiguracji, która mogłaby zwiększać cenę.
	 * @inf04-relevance Pokazuje prywatne pole oraz walidację danych wejściowych.
	 */
	public constructor(discountAmount: number) {
		validateNonNegativeAmount(discountAmount, "Kwota rabatu");
		this.discountAmount = discountAmount;
	}

	/**
	 * @description Odejmuję stały rabat, ograniczając cenę końcową do zera.
	 * @architectural-note Zabezpiecza system przed ujemną wartością zamówienia.
	 * @inf04-relevance To bezpośrednia implementacja wariantu ćwiczeniowego z karty pracy.
	 */
	public applyDiscount(totalAmount: number): number {
		validateNonNegativeAmount(totalAmount, "Wartość koszyka");
		return roundCurrency(Math.max(0, totalAmount - this.discountAmount));
	}
}

/**
 * @description Strategia, która nie zmienia wartości koszyka.
 * @architectural-note Eliminuje potrzebę specjalnych warunków w kontekście dla braku rabatu.
 * @inf04-relevance Pokazuje, że wariant domyślny również może być obiektem realizującym interfejs.
 */
class NoDiscount implements IDiscountStrategy {
	/**
	 * @description Zwraca poprawną, zaokrągloną wartość wejściową.
	 * @architectural-note Zachowuje jednolity sposób wywołania niezależnie od wybranej reguły.
	 * @inf04-relevance Utrwala polimorfizm bez instrukcji switch.
	 */
	public applyDiscount(totalAmount: number): number {
		validateNonNegativeAmount(totalAmount, "Wartość koszyka");
		return roundCurrency(totalAmount);
	}
}

/**
 * @description Strategia rabatu przyznawanego za punkty lojalnościowe klienta.
 * @architectural-note Oddziela regułę programu lojalnościowego od kodu obsługującego koszyk.
 * @inf04-relevance Pokazuje, jak można dodawać kolejne algorytmy bez modyfikowania kontekstu.
 */
class LoyaltyPointsStrategy implements IDiscountStrategy {
	/** @description Liczba punktów przeliczana na rabat. */
	private readonly points: number;
	/** @description Wartość pieniężna jednego punktu. */
	private readonly valuePerPoint: number;

	/**
	 * @description Konfiguruje liczbę punktów i ich wartość.
	 * @architectural-note Chroni kalkulator przed niejawnie przyjętymi, zmiennymi stawkami.
	 * @inf04-relevance Ćwiczy sprawdzanie parametrów i modelowanie reguł biznesowych.
	 */
	public constructor(points: number, valuePerPoint = 0.1) {
		if (!Number.isInteger(points) || points < 0) {
			throw new RangeError("Liczba punktów musi być nieujemną liczbą całkowitą.");
		}
		validateNonNegativeAmount(valuePerPoint, "Wartość punktu");
		this.points = points;
		this.valuePerPoint = valuePerPoint;
	}

	/**
	 * @description Odejmuję wartość punktów, nie pozwalając zejść poniżej zera.
	 * @architectural-note Reguła punktowa pozostaje zamknięta w swojej strategii.
	 * @inf04-relevance Uczeń może porównać kilka niezależnych implementacji jednego kontraktu.
	 */
	public applyDiscount(totalAmount: number): number {
		validateNonNegativeAmount(totalAmount, "Wartość koszyka");
		return roundCurrency(Math.max(0, totalAmount - this.points * this.valuePerPoint));
	}
}

/**
 * @description Przyznaje rabat równy kosztowi dostawy po przekroczeniu progu koszyka.
 * @architectural-note Nie miesza reguły darmowej dostawy z implementacją pozostałych rabatów.
 * @inf04-relevance Stanowi dodatkowy przykład rozszerzania rodziny strategii.
 */
class FreeShippingThresholdStrategy implements IDiscountStrategy {
	/** @description Minimalna wartość koszyka uruchamiająca rabat. */
	private readonly threshold: number;
	/** @description Koszt dostawy odejmowany po przekroczeniu progu. */
	private readonly shippingCost: number;

	/**
	 * @description Tworzy strategię rabatu odpowiadającego kosztowi dostawy.
	 * @architectural-note Utrzymuje parametry algorytmu w jednym, walidowanym obiekcie.
	 * @inf04-relevance Pokazuje konstruktory z wieloma parametrami domenowymi.
	 */
	public constructor(threshold: number, shippingCost: number) {
		validateNonNegativeAmount(threshold, "Próg darmowej dostawy");
		validateNonNegativeAmount(shippingCost, "Koszt dostawy");
		this.threshold = threshold;
		this.shippingCost = shippingCost;
	}

	/**
	 * @description Zwraca cenę po odjęciu dostawy, jeśli koszyk osiągnął wymagany próg.
	 * @architectural-note Kapsułkuje warunek biznesowy, który w przeciwnym razie trafiłby do kontekstu.
	 * @inf04-relevance Demonstruje wybór zachowania przez polimorficzne podstawienie strategii.
	 */
	public applyDiscount(totalAmount: number): number {
		validateNonNegativeAmount(totalAmount, "Wartość koszyka");
		const discount = totalAmount >= this.threshold ? this.shippingCost : 0;
		return roundCurrency(Math.max(0, totalAmount - discount));
	}
}

/**
 * @description Kontekst koszyka przekazujący obliczenia do aktualnie wstrzykniętej strategii.
 * @architectural-note Zależy od abstrakcji, a nie od klas rabatów; nie zawiera drabinki warunków.
 * @inf04-relevance Realizuje relację Context–Strategy oraz dynamiczną zmianę zachowania w runtime.
 */
class CartContext {
	/** @description Aktualna strategia rabatowa koszyka. */
	private strategy: IDiscountStrategy;

	/**
	 * @description Tworzy kontekst z początkową strategią.
	 * @architectural-note Wymusza jawne skonfigurowanie zachowania zamiast ukrytej zależności globalnej.
	 * @inf04-relevance Pokazuje wstrzykiwanie zależności przez konstruktor.
	 */
	public constructor(strategy: IDiscountStrategy) {
		this.strategy = strategy;
	}

	/**
	 * @description Podmienia algorytm bez tworzenia nowego kontekstu.
	 * @architectural-note Umożliwia zmianę reguły w runtime i nie wiąże kontekstu z konkretną klasą.
	 * @inf04-relevance Jest technicznym mechanizmem dynamicznego wyboru strategii wymaganym w scenariuszu.
	 */
	public setStrategy(strategy: IDiscountStrategy): void {
		this.strategy = strategy;
	}

	/**
	 * @description Zwraca wartość koszyka po obliczeniu wybranej strategii.
	 * @architectural-note Kontekst deleguje algorytm zamiast samodzielnie rozpoznawać rodzaj rabatu.
	 * @inf04-relevance Pokazuje kompozycję i wywołanie polimorficzne.
	 */
	public calculateTotal(totalAmount: number): number {
		return this.strategy.applyDiscount(totalAmount);
	}
}

/**
 * @description Dane wejściowe monolitycznego kalkulatora kosztu dostawy używanego jako antyprzykład.
 * @architectural-note Jawny typ wejściowy ułatwia zauważenie, ile detali transportowych zna jeden kalkulator.
 * @inf04-relevance Uczeń analizuje code smell wskazany w karcie audytu.
 */
interface LegacyDeliveryInput {
	readonly carrier: string;
	readonly weightKg: number;
	readonly distanceKm: number;
	readonly isExpress: boolean;
}

/**
 * @description Monolityczny kalkulator dostawy z instrukcją switch, celowo zachowany jako kod „przed zmianą”.
 * @architectural-note Dług technologiczny: każda nowa firma wymaga zmiany i ponownego testowania klasy zawierającej wszystkie algorytmy.
 * @inf04-relevance Uczeń potrafi wskazać naruszenie OCP i uzasadnić wydzielenie IShippingStrategy.
 */
class LegacyShippingCostCalculator {
	/**
	 * @description Wycenia przesyłkę, wybierając algorytm przez rozbudowany switch.
	 * @architectural-note Zmiana jednego przewoźnika może przypadkowo naruszyć pozostałe gałęzie.
	 * @inf04-relevance Odtwarza antywzorzec z materiału audytowego i pozwala porównać refaktoryzację.
	 */
	public calculate(input: LegacyDeliveryInput): number {
		const { carrier, weightKg, distanceKm, isExpress } = input;
		validateNonNegativeAmount(weightKg, "Masa przesyłki");
		validateNonNegativeAmount(distanceKm, "Dystans przesyłki");
		let finalCost = 0;

		switch (carrier.toUpperCase()) {
			case "DHL":
				finalCost = 15 + weightKg * 1.8;
				if (distanceKm > 100) {
					finalCost += (distanceKm - 100) * 0.4;
				}
				if (isExpress) {
					finalCost *= 1.3;
				}
				break;
			case "INPOST_PACZKOMAT":
				if (weightKg > 25) {
					throw new RangeError("Przesyłka jest zbyt ciężka dla automatu Paczkomat.");
				}
				finalCost = 12.5 + (isExpress ? 5 : 0);
				break;
			case "DPD_COURIER":
				finalCost = 18 + weightKg * 2.1;
				if (distanceKm > 200) {
					finalCost += 25;
				}
				break;
			case "POCZTA_POLSKA":
				finalCost = 9.9 + weightKg * 0.95;
				break;
			default:
				throw new Error(`Nieobsługiwany przewoźnik: ${carrier}`);
		}

		return roundCurrency(finalCost);
	}
}

/**
 * @description Ujednolica parametry przekazywane do strategii wyceny przesyłki.
 * @architectural-note Nie pozwala każdej strategii interpretować zestawu parametrów na własny sposób.
 * @inf04-relevance Jest DTO współdzielonym przez kontekst oraz konkretne algorytmy.
 */
interface DeliveryQuote {
	readonly weightKg: number;
	readonly distanceKm: number;
	readonly isExpress: boolean;
}

/**
 * @description Wspólny kontrakt algorytmów wyceny dostawy.
 * @architectural-note Zastępuje rozpoznawanie przewoźnika przez switch wspólnym typem abstrakcyjnym.
 * @inf04-relevance Pokazuje projektowanie interfejsu dla rodziny algorytmów.
 */
interface IShippingStrategy {
	/**
	 * @description Wylicza koszt dostawy zgodnie z regułami konkretnego przewoźnika.
	 * @architectural-note Oddziela wycenę od wyboru oraz konfiguracji przewoźnika.
	 * @inf04-relevance Uczeń potrafi zaprojektować sygnaturę wspólną dla niezależnych strategii.
	 */
	calculateCost(quote: DeliveryQuote): number;
}

/**
 * @description Oblicza koszt przewoźnika DHL, w tym dopłatę strefową i ekspresową.
 * @architectural-note Zmiana taryfy DHL nie wymaga modyfikacji pozostałych przewoźników.
 * @inf04-relevance Jest konkretną implementacją interfejsu strategii dostawy.
 */
class DhlShippingStrategy implements IShippingStrategy {
	/**
	 * @description Wycenia przesyłkę według przykładowej taryfy DHL.
	 * @architectural-note Szczegóły taryfy pozostają poza kodem wybierającym przewoźnika.
	 * @inf04-relevance Ćwiczy przenoszenie gałęzi switch do osobnej klasy.
	 */
	public calculateCost(quote: DeliveryQuote): number {
		validateDeliveryQuote(quote);
		let cost = 15 + quote.weightKg * 1.8;
		if (quote.distanceKm > 100) {
			cost += (quote.distanceKm - 100) * 0.4;
		}
		if (quote.isExpress) {
			cost *= 1.3;
		}
		return roundCurrency(cost);
	}
}

/**
 * @description Oblicza koszt dostawy do automatu z limitem wagi.
 * @architectural-note Ograniczenie techniczne InPost nie zanieczyszcza algorytmów innych przewoźników.
 * @inf04-relevance Pokazuje obsługę reguły brzegowej wewnątrz konkretnej strategii.
 */
class InpostParcelLockerStrategy implements IShippingStrategy {
	/**
	 * @description Wycenia przesyłkę do automatu i odrzuca przesyłki przekraczające limit.
	 * @architectural-note Walidacja właściwa dla przewoźnika jest kapsułkowana wraz z jego taryfą.
	 * @inf04-relevance Uczeń ćwiczy wyjątki oraz niezależne testowanie strategii.
	 */
	public calculateCost(quote: DeliveryQuote): number {
		validateDeliveryQuote(quote);
		if (quote.weightKg > 25) {
			throw new RangeError("Przesyłka jest zbyt ciężka dla automatu Paczkomat.");
		}
		return roundCurrency(12.5 + (quote.isExpress ? 5 : 0));
	}
}

/**
 * @description Oblicza koszt kuriera DPD z dopłatą za daleką strefę.
 * @architectural-note Reguły DPD są izolowane, więc dodanie przewoźnika nie zmienia istniejących klas.
 * @inf04-relevance Utrwala zasadę Open/Closed na praktycznym przykładzie.
 */
class DpdCourierStrategy implements IShippingStrategy {
	/**
	 * @description Wycenia przesyłkę DPD na podstawie masy i dystansu.
	 * @architectural-note Oddziela taryfę od klienta korzystającego z wyceny.
	 * @inf04-relevance Pokazuje drugą wymienną strategię z innymi regułami.
	 */
	public calculateCost(quote: DeliveryQuote): number {
		validateDeliveryQuote(quote);
		const cost = 18 + quote.weightKg * 2.1 + (quote.distanceKm > 200 ? 25 : 0);
		return roundCurrency(cost);
	}
}

/**
 * @description Oblicza koszt przesyłki według przykładowej taryfy Poczty Polskiej.
 * @architectural-note Prosta taryfa również realizuje ten sam kontrakt, bez wyjątkowej ścieżki w kontekście.
 * @inf04-relevance Pokazuje, że implementacje mogą mieć różną złożoność, zachowując wspólny interfejs.
 */
class PolishPostStrategy implements IShippingStrategy {
	/**
	 * @description Wycenia przesyłkę na podstawie jej masy.
	 * @architectural-note Algorytm jest wymienny bez zmian po stronie odbiorcy.
	 * @inf04-relevance Uczeń może testować tę klasę bez tworzenia monolitycznego kalkulatora.
	 */
	public calculateCost(quote: DeliveryQuote): number {
		validateDeliveryQuote(quote);
		return roundCurrency(9.9 + quote.weightKg * 0.95);
	}
}

/**
 * @description Kontekst dostawy delegujący wycenę do wybranej strategii przewoźnika.
 * @architectural-note Nie zawiera listy przewoźników ani switcha, który wymagałby zmian przy rozbudowie.
 * @inf04-relevance Pokazuje asocjację kontekstu z interfejsem strategii.
 */
class DeliveryCostCalculator {
	/** @description Aktualna strategia wyceny przesyłki. */
	private strategy: IShippingStrategy;

	/**
	 * @description Tworzy kalkulator z wybraną strategią dostawy.
	 * @architectural-note Wymusza korzystanie z kontraktu zamiast konkretnej klasy przewoźnika.
	 * @inf04-relevance Demonstruje kompozycję oraz wstrzykiwanie zależności.
	 */
	public constructor(strategy: IShippingStrategy) {
		this.strategy = strategy;
	}

	/**
	 * @description Zmienia przewoźnika bez przebudowy kontekstu.
	 * @architectural-note Wybór algorytmu jest niezależny od jego wykonania.
	 * @inf04-relevance Utrwala dynamiczną podmianę strategii przez setter.
	 */
	public setStrategy(strategy: IShippingStrategy): void {
		this.strategy = strategy;
	}

	/**
	 * @description Zleca aktualnej strategii obliczenie kosztu przesyłki.
	 * @architectural-note Kontekst nie poznaje szczegółów taryfy ani klasy konkretnej.
	 * @inf04-relevance Pokazuje polimorficzne wywołanie metody interfejsu.
	 */
	public calculate(quote: DeliveryQuote): number {
		return this.strategy.calculateCost(quote);
	}
}

/**
 * @description Rozróżnia obsługiwane kanały płatności.
 * @architectural-note Typ unii ogranicza przypadkowe użycie nieobsługiwanej nazwy metody.
 * @inf04-relevance Pokazuje ścisłe typowanie wartości domenowych w TypeScript.
 */
type PaymentMethod = "BLIK" | "CARD" | "PAYPAL" | "PAY_LATER";

/**
 * @description DTO żądania płatniczego dla kodu BLIK.
 * @architectural-note Dane uwierzytelniające są jawnie oddzielone od danych innych metod.
 * @inf04-relevance Ćwiczy modelowanie DTO oraz typów rozłącznych.
 */
interface BlikPaymentRequest {
	readonly method: "BLIK";
	readonly amount: number;
	readonly code: string;
}

/**
 * @description DTO żądania płatniczego dla karty.
 * @architectural-note Zapobiega przekazywaniu pól karty do strategii, która ich nie potrzebuje.
 * @inf04-relevance Pokazuje typowanie danych formularza i kontraktów między warstwami.
 */
interface CardPaymentRequest {
	readonly method: "CARD";
	readonly amount: number;
	readonly cardNumber: string;
	readonly cvv: string;
}

/**
 * @description DTO żądania płatniczego dla PayPal.
 * @architectural-note Token integracyjny ma własny, ograniczony typ żądania.
 * @inf04-relevance Uczeń poznaje typy interfejsów używane do wymiany danych.
 */
interface PayPalPaymentRequest {
	readonly method: "PAYPAL";
	readonly amount: number;
	readonly accountToken: string;
}

/**
 * @description DTO żądania płatności odroczonej.
 * @architectural-note Nowy kanał jest dodany jako nowy wariant, bez dopisywania algorytmu do kontekstu.
 * @inf04-relevance Demonstruje rozbudowę systemu przez nową strategię.
 */
interface PayLaterPaymentRequest {
	readonly method: "PAY_LATER";
	readonly amount: number;
	readonly customerId: string;
}

/**
 * @description Unia wszystkich poprawnie uformowanych żądań płatniczych.
 * @architectural-note Rozróżniające pole method umożliwia bezpieczne zawężanie typu bez any.
 * @inf04-relevance Pokazuje unię dyskryminowaną i kontrolę typów przy wielu wariantach danych.
 */
type PaymentRequest =
	| BlikPaymentRequest
	| CardPaymentRequest
	| PayPalPaymentRequest
	| PayLaterPaymentRequest;

/**
 * @description DTO wyniku płatności zwracane klientowi kontekstu.
 * @architectural-note Ukrywa szczegóły integracji i standaryzuje rezultat wszystkich metod płatności.
 * @inf04-relevance Odpowiada wymaganej strukturze statusu oraz identyfikatora transakcji.
 */
interface PaymentResult {
	readonly success: boolean;
	readonly transactionId: string;
	readonly status: "APPROVED" | "DECLINED" | "FAILED";
	readonly message: string;
}

/**
 * @description Wspólny kontrakt asynchronicznego algorytmu płatności.
 * @architectural-note PaymentProcessor zależy od abstrakcji, a strategie mogą używać różnych procedur.
 * @inf04-relevance Łączy interfejs wzorca Strategia z typowaniem Promise w TypeScript.
 */
interface IPaymentStrategy {
	/**
	 * @description Przetwarza żądanie i zwraca ujednolicony wynik transakcji.
	 * @architectural-note Asynchroniczne szczegóły kanału nie przeciekają do kontrolera ani kontekstu.
	 * @inf04-relevance Uczeń ćwiczy typowanie metod asynchronicznych oraz DTO.
	 */
	pay(request: PaymentRequest): Promise<PaymentResult>;
}

/**
 * @description Kontrakt lokalnej, symulowanej bramki bankowej.
 * @architectural-note Oddziela algorytm metody płatniczej od integracji z zewnętrznym dostawcą.
 * @inf04-relevance Pokazuje kolejny kontrakt oraz możliwość podstawienia implementacji testowej.
 */
interface IPaymentGateway {
	/**
	 * @description Symuluje autoryzację kwoty dla wskazanego kanału płatności.
	 * @architectural-note Strategie nie implementują transportu ani nie są uzależnione od konkretnej bramki.
	 * @inf04-relevance Demonstruje współpracę obiektów przez interfejsy.
	 */
	authorize(method: PaymentMethod, amount: number): Promise<string>;
}

/**
 * @description In-memory bramka płatnicza używana do uruchamialnej symulacji bez zewnętrznych zależności.
 * @architectural-note Zastępuje prawdziwe API w przykładzie dydaktycznym i umożliwia deterministyczny test awarii.
 * @inf04-relevance Pozwala uruchomić i przetestować asynchroniczny kod bez instalowania pakietów npm.
 */
class InMemoryPaymentGateway implements IPaymentGateway {
	/** @description Metody, dla których symulacja ma odrzucić autoryzację. */
	private readonly declinedMethods: ReadonlySet<PaymentMethod>;
	/** @description Licznik zapewniający czytelne, unikalne identyfikatory w demonstracji. */
	private transactionSequence = 0;

	/**
	 * @description Konfiguruje deterministyczne odrzucenia dla scenariusza brzegowego.
	 * @architectural-note Test nie zależy od sieci, przypadkowej odpowiedzi ani rzeczywistego obciążania banku.
	 * @inf04-relevance Uczeń widzi, jak wstrzyknąć symulowaną zależność do kodu.
	 */
	public constructor(declinedMethods: ReadonlySet<PaymentMethod> = new Set<PaymentMethod>()) {
		this.declinedMethods = declinedMethods;
	}

	/**
	 * @description Asynchronicznie autoryzuje kwotę i zwraca identyfikator symulowanej transakcji.
	 * @architectural-note Bramka zwraca błąd dla odrzuconej płatności zamiast ukrywać go w strategii.
	 * @inf04-relevance Demonstruje Promise, wyjątki asynchroniczne oraz separację odpowiedzialności.
	 */
	public async authorize(method: PaymentMethod, amount: number): Promise<string> {
		validateNonNegativeAmount(amount, "Kwota płatności");
		if (amount === 0) {
			throw new RangeError("Kwota płatności musi być większa od zera.");
		}
		await Promise.resolve();
		if (this.declinedMethods.has(method)) {
			throw new Error(`Bramka odrzuciła metodę ${method}.`);
		}
		this.transactionSequence += 1;
		return `${method}_${this.transactionSequence.toString().padStart(4, "0")}`;
	}
}

/**
 * @description Fabryka wybierająca strategię na podstawie metody wskazanej w żądaniu.
 * @architectural-note Decyzja o konfiguracji jest poza kontekstem wykonującym płatność.
 * @inf04-relevance Realizuje punkt fabrykacji wskazany w schemacie HTTP checkout.
 */
class PaymentStrategyFactory {
	/** @description Wspólna bramka przekazywana tworzonym strategiom. */
	private readonly gateway: IPaymentGateway;

	/**
	 * @description Tworzy fabrykę korzystającą z podanej bramki płatniczej.
	 * @architectural-note Jedna zależność integracyjna jest przekazywana strategiom zamiast tworzona globalnie.
	 * @inf04-relevance Pokazuje konstruktor i kompozycję klas pomocniczych.
	 */
	public constructor(gateway: IPaymentGateway) {
		this.gateway = gateway;
	}

	/**
	 * @description Tworzy konkretną strategię zgodną z dyskryminującym polem żądania.
	 * @architectural-note Zmiana wybranego algorytmu jest skupiona w konfiguracji, a nie w kontekście płatności.
	 * @inf04-relevance Uczeń ćwiczy zawężanie unii i oddzielenie wyboru od wykonania strategii.
	 */
	public create(request: PaymentRequest): IPaymentStrategy {
		switch (request.method) {
			case "BLIK":
				return new BlikPaymentStrategy(this.gateway);
			case "CARD":
				return new CardPaymentStrategy(this.gateway);
			case "PAYPAL":
				return new PayPalPaymentStrategy(this.gateway);
			case "PAY_LATER":
				return new PayLaterPaymentStrategy(this.gateway);
			default:
				return assertNever(request);
		}
	}
}

/**
 * @description Wspólna baza ułatwiająca walidację i raportowanie przez strategie płatności.
 * @architectural-note Współdzielone zachowanie jest centralizowane, a algorytmy kanałów pozostają rozdzielone.
 * @inf04-relevance Pokazuje klasę bazową używaną razem z interfejsem i polimorfizmem.
 */
abstract class PaymentStrategyBase implements IPaymentStrategy {
	/** @description Bramka wykorzystywana do autoryzacji transakcji. */
	protected readonly gateway: IPaymentGateway;

	/**
	 * @description Przekazuje strategii zależność od bramki.
	 * @architectural-note Klasa bazowa nie tworzy integracji samodzielnie, więc pozostaje testowalna.
	 * @inf04-relevance Uczeń ćwiczy protected oraz wstrzykiwanie zależności.
	 */
	protected constructor(gateway: IPaymentGateway) {
		this.gateway = gateway;
	}

	/**
	 * @description Sprawdza, czy żądanie ma metodę obsługiwaną przez konkretną strategię.
	 * @architectural-note Odrzuca niezgodne wywołanie w sposób jawny, zamiast używać niebezpiecznego rzutowania.
	 * @inf04-relevance Demonstruje type guard dla unii rozłącznej.
	 */
	protected ensureMethod<T extends PaymentRequest>(
		request: PaymentRequest,
		method: T["method"]
	): request is T {
		return request.method === method;
	}

	/**
	 * @description Tworzy ujednolicony wynik nieudanej próby płatności.
	 * @architectural-note Klienci zawsze otrzymują stabilny DTO, nawet gdy integracja zgłosi wyjątek.
	 * @inf04-relevance Uczeń ćwiczy obsługę błędów i modelowanie odpowiedzi.
	 */
	protected failedResult(message: string): PaymentResult {
		return {
			success: false,
			transactionId: "",
			status: "FAILED",
			message
		};
	}

	/**
	 * @description Obsługuje wspólną umowę asynchronicznego algorytmu płatniczego.
	 * @architectural-note Klasy konkretne muszą jawnie dostarczyć własną procedurę.
	 * @inf04-relevance Pokazuje abstrakcyjną klasę realizującą interfejs strategii.
	 */
	public abstract pay(request: PaymentRequest): Promise<PaymentResult>;
}

/**
 * @description Strategia autoryzacji płatności kodem BLIK.
 * @architectural-note Walidacja kodu jest izolowana od strategii karty, PayPal i płatności odroczonej.
 * @inf04-relevance Odpowiada przykładowej strategii BLIK z zadania projektowego.
 */
class BlikPaymentStrategy extends PaymentStrategyBase {
	/**
	 * @description Tworzy strategię BLIK korzystającą z bramki.
	 * @architectural-note Integracja jest wstrzykiwana i może być zastąpiona symulacją.
	 * @inf04-relevance Pokazuje dziedziczenie przy zachowaniu kontraktu strategii.
	 */
	public constructor(gateway: IPaymentGateway) {
		super(gateway);
	}

	/**
	 * @description Weryfikuje sześciocyfrowy kod i symuluje autoryzację BLIK.
	 * @architectural-note Błędne dane są odrzucane przed wywołaniem zewnętrznej bramki.
	 * @inf04-relevance Uczeń ćwiczy walidację, regex oraz obsługę błędów asynchronicznych.
	 */
	public async pay(request: PaymentRequest): Promise<PaymentResult> {
		if (!this.ensureMethod<BlikPaymentRequest>(request, "BLIK")) {
			return this.failedResult("Strategia BLIK otrzymała niezgodny typ żądania.");
		}
		if (!/^\d{6}$/.test(request.code)) {
			return {
				success: false,
				transactionId: "",
				status: "DECLINED",
				message: "Kod BLIK musi składać się dokładnie z sześciu cyfr."
			};
		}
		try {
			const transactionId = await this.gateway.authorize("BLIK", request.amount);
			return successfulPayment(transactionId, "Płatność BLIK została zaakceptowana.");
		} catch (error: unknown) {
			return this.failedResult(errorMessage(error));
		}
	}
}

/**
 * @description Strategia autoryzacji płatności kartą.
 * @architectural-note Dane i walidacja karty są oddzielone od pozostałych procedur płatniczych.
 * @inf04-relevance Pokazuje strategię z innymi wymaganymi danymi wejściowymi.
 */
class CardPaymentStrategy extends PaymentStrategyBase {
	/**
	 * @description Tworzy strategię płatności kartą.
	 * @architectural-note Bramka jest przekazywana z zewnątrz, bez zależności od konkretnego API.
	 * @inf04-relevance Utrwala kompozycję i wstrzykiwanie zależności.
	 */
	public constructor(gateway: IPaymentGateway) {
		super(gateway);
	}

	/**
	 * @description Sprawdza podstawowy format karty i CVV, po czym symuluje autoryzację.
	 * @architectural-note Strategia nie ujawnia danych karty kontekstowi ani innym kanałom.
	 * @inf04-relevance Ćwiczy walidację wejścia oraz asynchroniczną obsługę wyniku.
	 */
	public async pay(request: PaymentRequest): Promise<PaymentResult> {
		if (!this.ensureMethod<CardPaymentRequest>(request, "CARD")) {
			return this.failedResult("Strategia karty otrzymała niezgodny typ żądania.");
		}
		const normalizedCardNumber = request.cardNumber.replace(/\s/g, "");
		if (!/^\d{12,19}$/.test(normalizedCardNumber) || !/^\d{3,4}$/.test(request.cvv)) {
			return {
				success: false,
				transactionId: "",
				status: "DECLINED",
				message: "Numer karty lub CVV ma nieprawidłowy format."
			};
		}
		try {
			const transactionId = await this.gateway.authorize("CARD", request.amount);
			return successfulPayment(transactionId, "Płatność kartą została zaakceptowana.");
		} catch (error: unknown) {
			return this.failedResult(errorMessage(error));
		}
	}
}

/**
 * @description Strategia realizacji płatności przez PayPal.
 * @architectural-note Procedura zewnętrznego portfela nie jest dopisywana do klasy kontekstu.
 * @inf04-relevance Pokazuje łatwe dodawanie kolejnych implementacji interfejsu strategii.
 */
class PayPalPaymentStrategy extends PaymentStrategyBase {
	/**
	 * @description Tworzy strategię PayPal z bramką płatniczą.
	 * @architectural-note Zapewnia testowalność bez prawdziwego konta ani biblioteki integracyjnej.
	 * @inf04-relevance Demonstruje konstruktor konkretnej klasy strategii.
	 */
	public constructor(gateway: IPaymentGateway) {
		super(gateway);
	}

	/**
	 * @description Weryfikuje token konta i uruchamia symulowaną autoryzację.
	 * @architectural-note Reguła tokenu należy do kanału PayPal, a nie do ogólnego procesora.
	 * @inf04-relevance Pokazuje ten sam kontrakt i odmienny algorytm.
	 */
	public async pay(request: PaymentRequest): Promise<PaymentResult> {
		if (!this.ensureMethod<PayPalPaymentRequest>(request, "PAYPAL")) {
			return this.failedResult("Strategia PayPal otrzymała niezgodny typ żądania.");
		}
		if (request.accountToken.trim().length < 8) {
			return {
				success: false,
				transactionId: "",
				status: "DECLINED",
				message: "Token konta PayPal jest nieprawidłowy."
			};
		}
		try {
			const transactionId = await this.gateway.authorize("PAYPAL", request.amount);
			return successfulPayment(transactionId, "Płatność PayPal została zaakceptowana.");
		} catch (error: unknown) {
			return this.failedResult(errorMessage(error));
		}
	}
}

/**
 * @description Strategia płatności odroczonej dodana jako rozszerzenie bez zmiany kontekstu.
 * @architectural-note Nowy algorytm jest nową klasą, więc PaymentProcessor nie musi znać jego szczegółów.
 * @inf04-relevance Jest demonstracją OCP i zmiany biznesowej PayPo/Klarna z lekcji.
 */
class PayLaterPaymentStrategy extends PaymentStrategyBase {
	/**
	 * @description Tworzy strategię płatności odroczonej.
	 * @architectural-note Zależność bramki pozostaje wymienna i niezależna od klasy procesora.
	 * @inf04-relevance Pokazuje rozbudowę systemu przez dodanie Concrete Strategy.
	 */
	public constructor(gateway: IPaymentGateway) {
		super(gateway);
	}

	/**
	 * @description Weryfikuje identyfikator klienta i symuluje przyznanie płatności odroczonej.
	 * @architectural-note Procedura nowej metody nie wymaga edycji istniejących algorytmów.
	 * @inf04-relevance Uczeń uzasadnia, że dodanie strategii nie wymaga modyfikacji kontekstu.
	 */
	public async pay(request: PaymentRequest): Promise<PaymentResult> {
		if (!this.ensureMethod<PayLaterPaymentRequest>(request, "PAY_LATER")) {
			return this.failedResult("Strategia płatności odroczonej otrzymała niezgodny typ żądania.");
		}
		if (request.customerId.trim().length < 3) {
			return {
				success: false,
				transactionId: "",
				status: "DECLINED",
				message: "Identyfikator klienta jest nieprawidłowy."
			};
		}
		try {
			const transactionId = await this.gateway.authorize("PAY_LATER", request.amount);
			return successfulPayment(transactionId, "Płatność odroczona została zaakceptowana.");
		} catch (error: unknown) {
			return this.failedResult(errorMessage(error));
		}
	}
}

/**
 * @description Kontekst płatności delegujący transakcję do wskazanej strategii.
 * @architectural-note Nie zna BLIK-a, karty ani PayPal; współpracuje wyłącznie z kontraktem.
 * @inf04-relevance Realizuje centralny element wzorca Strategy z przykładu płatności.
 */
class PaymentContext {
	/** @description Aktualna strategia obsługująca płatność. */
	private strategy: IPaymentStrategy;

	/**
	 * @description Tworzy kontekst z początkową strategią.
	 * @architectural-note Wstrzykuje zachowanie zamiast kodować wybór w kontekście.
	 * @inf04-relevance Pokazuje konstruktorowe wstrzykiwanie zależności.
	 */
	public constructor(strategy: IPaymentStrategy) {
		this.strategy = strategy;
	}

	/**
	 * @description Umożliwia zmianę strategii płatności w czasie działania programu.
	 * @architectural-note Klient może podmienić algorytm bez przebudowy obiektu kontekstu.
	 * @inf04-relevance Odpowiada pytaniu exit ticket o mechanizm zmiany runtime.
	 */
	public setStrategy(strategy: IPaymentStrategy): void {
		this.strategy = strategy;
	}

	/**
	 * @description Wykonuje płatność, delegując ją do bieżącej strategii.
	 * @architectural-note Kontekst nie zawiera instrukcji switch rozpoznającej kanał płatności.
	 * @inf04-relevance Pokazuje polimorfizm i asynchroniczne delegowanie zadania.
	 */
	public async executePayment(request: PaymentRequest): Promise<PaymentResult> {
		return this.strategy.pay(request);
	}
}

/**
 * @description Procesor realizujący przepływ: wybór strategii, konfiguracja kontekstu i wykonanie płatności.
 * @architectural-note Wybór algorytmu jest w fabryce, a jego wykonanie w kontekście, co rozdziela odpowiedzialności.
 * @inf04-relevance Symuluje warstwę aplikacyjną wywoływaną przez kontroler endpointu checkout.
 */
class PaymentProcessor {
	/** @description Fabryka konfigurująca wymaganą strategię. */
	private readonly strategyFactory: PaymentStrategyFactory;
	/** @description Kontekst używany do wykonania bieżącej płatności. */
	private readonly context: PaymentContext;

	/**
	 * @description Tworzy procesor z fabryką i początkową strategią.
	 * @architectural-note Zależności są przekazane z zewnątrz, a kontekst pozostaje niezależny od kanałów.
	 * @inf04-relevance Pokazuje współpracę kilku obiektów w prostym przepływie aplikacyjnym.
	 */
	public constructor(strategyFactory: PaymentStrategyFactory) {
		this.strategyFactory = strategyFactory;
		this.context = new PaymentContext(new NoPaymentStrategy());
	}

	/**
	 * @description Przetwarza żądanie, dynamicznie dobierając i ustawiając strategię przed wykonaniem.
	 * @architectural-note Klasa kontekstu nie wymaga modyfikacji, gdy z fabryką współpracuje nowa strategia.
	 * @inf04-relevance Demonstruje runtime polymorphism oraz dynamiczne wstrzykiwanie strategii.
	 */
	public async process(request: PaymentRequest): Promise<PaymentResult> {
		this.context.setStrategy(this.strategyFactory.create(request));
		return this.context.executePayment(request);
	}
}

/**
 * @description Strategia ochronna używana wyłącznie jako stan początkowy procesora.
 * @architectural-note Brak skonfigurowanej metody nie powoduje pustej metody ani niejawnego sukcesu.
 * @inf04-relevance Pokazuje jawne reprezentowanie stanu niepoprawnej konfiguracji.
 */
class NoPaymentStrategy implements IPaymentStrategy {
	/**
	 * @description Zwraca błąd, jeśli płatność wywołano przed wyborem konkretnej strategii.
	 * @architectural-note Nie pozwala zgłosić fikcyjnego powodzenia przy braku konfiguracji.
	 * @inf04-relevance Uczeń ćwiczy implementację kontraktu również dla przypadku brzegowego.
	 */
	public async pay(_request: PaymentRequest): Promise<PaymentResult> {
		return {
			success: false,
			transactionId: "",
			status: "FAILED",
			message: "Nie wybrano strategii płatności."
		};
	}
}

/**
 * @description Sprawdza, czy kwota jest skończona i nieujemna.
 * @architectural-note Wspólna walidacja nie jest kopiowana w każdej strategii obliczeniowej.
 * @inf04-relevance Pokazuje funkcję pomocniczą z typowanymi parametrami i wyjątkami.
 */
function validateNonNegativeAmount(value: number, label: string): void {
	if (!Number.isFinite(value) || value < 0) {
		throw new RangeError(`${label} musi być skończoną i nieujemną liczbą.`);
	}
}

/**
 * @description Waliduje masę i dystans wspólne dla strategii dostawy.
 * @architectural-note Dane wejściowe są odrzucane przed obliczeniami, a nie prowadzą do błędnej wyceny.
 * @inf04-relevance Ćwiczy walidację obiektów DTO przekazywanych do metod.
 */
function validateDeliveryQuote(quote: DeliveryQuote): void {
	validateNonNegativeAmount(quote.weightKg, "Masa przesyłki");
	validateNonNegativeAmount(quote.distanceKm, "Dystans przesyłki");
}

/**
 * @description Zaokrągla kwotę do dwóch miejsc po przecinku.
 * @architectural-note Wspólny format pieniężny zapobiega rozbieżnościom między strategiami.
 * @inf04-relevance Uczeń poznaje funkcję pomocniczą wspieraną przez standard ECMAScript.
 */
function roundCurrency(amount: number): number {
	return Math.round((amount + Number.EPSILON) * 100) / 100;
}

/**
 * @description Buduje wynik zaakceptowanej transakcji.
 * @architectural-note Wszystkie strategie zwracają identyczny kształt DTO dla sukcesu.
 * @inf04-relevance Pokazuje ponowne użycie funkcji i ścisłe typowanie odpowiedzi.
 */
function successfulPayment(transactionId: string, message: string): PaymentResult {
	return {
		success: true,
		transactionId,
		status: "APPROVED",
		message
	};
}

/**
 * @description Zamienia nieznany wyjątek na bezpieczny komunikat tekstowy.
 * @architectural-note Wartość unknown jest zawężana, więc błąd nie wymaga niebezpiecznego typu any.
 * @inf04-relevance Uczeń ćwiczy bezpieczną obsługę wyjątków w trybie strict.
 */
function errorMessage(error: unknown): string {
	return error instanceof Error ? error.message : "Wystąpił nieznany błąd płatności.";
}

/**
 * @description Wymusza pełną obsługę unii rozłącznej podczas wyboru strategii.
 * @architectural-note Nowy wariant typu nie może zostać po cichu pominięty przez fabrykę.
 * @inf04-relevance Pokazuje kontrolę kompletności switch w TypeScript.
 */
function assertNever(value: never): never {
	throw new Error(`Nieobsługiwany wariant: ${String(value)}`);
}

/**
 * @description Uruchamia przykłady antywzorca, refaktoryzacji, podmiany strategii i płatności.
 * @architectural-note Jawne scenariusze sukcesu i awarii pokazują zachowanie całego przepływu, a nie tylko deklaracje klas.
 * @inf04-relevance Jest samodzielnym kodem klienta, który uczeń może skompilować i uruchomić.
 */
async function main(): Promise<void> {
	console.log("=== Zadanie 1: antywzorzec switch i audyt dostawy ===");
	const legacyCalculator = new LegacyShippingCostCalculator();
	console.log("Koszt DHL (przed refaktoryzacją):", legacyCalculator.calculate({
		carrier: "DHL",
		weightKg: 2,
		distanceKm: 150,
		isExpress: true
	}));

	console.log("=== Zadanie 2: koszyk i zmiana strategii rabatowej ===");
	const cart = new CartContext(new NoDiscount());
	console.log("Cena bez rabatu:", cart.calculateTotal(200));
	cart.setStrategy(new PercentageDiscount(20));
	console.log("Cena po rabacie 20%:", cart.calculateTotal(200));
	cart.setStrategy(new FixedAmountDiscount(250));
	console.log("Cena po rabacie stałym (dolna granica 0):", cart.calculateTotal(200));
	cart.setStrategy(new LoyaltyPointsStrategy(100));
	console.log("Cena po wykorzystaniu punktów:", cart.calculateTotal(200));
	cart.setStrategy(new FreeShippingThresholdStrategy(150, 12.5));
	console.log("Cena po rabacie równym dostawie:", cart.calculateTotal(200));

	console.log("=== Refaktoryzacja dostawy: niezależne strategie ===");
	const shippingCalculator = new DeliveryCostCalculator(new DhlShippingStrategy());
	const quote: DeliveryQuote = { weightKg: 2, distanceKm: 150, isExpress: true };
	console.log("DHL:", shippingCalculator.calculate(quote));
	shippingCalculator.setStrategy(new DpdCourierStrategy());
	console.log("DPD po podmianie strategii:", shippingCalculator.calculate(quote));
	shippingCalculator.setStrategy(new PolishPostStrategy());
	console.log("Poczta Polska po kolejnej podmianie:", shippingCalculator.calculate(quote));
	try {
		shippingCalculator.setStrategy(new InpostParcelLockerStrategy());
		console.log("InPost, przesyłka ponad limit:", shippingCalculator.calculate({
			weightKg: 30,
			distanceKm: 10,
			isExpress: false
		}));
	} catch (error: unknown) {
		console.log("Oczekiwana reguła brzegowa InPost:", errorMessage(error));
	}

	console.log("=== Zadanie 3: wielokanałowy silnik płatności ===");
	const gateway = new InMemoryPaymentGateway(new Set<PaymentMethod>(["PAYPAL"]));
	const processor = new PaymentProcessor(new PaymentStrategyFactory(gateway));
	const successfulBlik: PaymentRequest = { method: "BLIK", amount: 149.9, code: "123456" };
	console.log("Płatność BLIK:", await processor.process(successfulBlik));
	const successfulCard: PaymentRequest = {
		method: "CARD",
		amount: 89.5,
		cardNumber: "4111 1111 1111 1111",
		cvv: "123"
	};
	console.log("Płatność kartą:", await processor.process(successfulCard));

	console.log("=== Płatność odroczona dodana bez zmiany PaymentContext ===");
	const payLater: PaymentRequest = { method: "PAY_LATER", amount: 320, customerId: "KLIENT-42" };
	console.log("Płatność PayPo/Klarna:", await processor.process(payLater));

	console.log("=== Scenariusze awarii i dane brzegowe ===");
	const invalidBlik: PaymentRequest = { method: "BLIK", amount: 50, code: "12A" };
	console.log("Niepoprawny kod BLIK:", await processor.process(invalidBlik));
	const declinedPayPal: PaymentRequest = {
		method: "PAYPAL",
		amount: 75,
		accountToken: "TOKEN-123456"
	};
	console.log("Odrzucenie przez symulowaną bramkę:", await processor.process(declinedPayPal));
	const invalidCard: PaymentRequest = {
		method: "CARD",
		amount: 40,
		cardNumber: "123",
		cvv: "1"
	};
	console.log("Niepoprawne dane karty:", await processor.process(invalidCard));
	console.log("Wniosek: kontekst deleguje wykonanie; klient lub fabryka wybiera strategię.");
}

void main().catch((error: unknown) => {
	console.error("Nieoczekiwany błąd demonstracji:", errorMessage(error));
});
