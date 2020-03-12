describe("Index", () => {
  test("should sumar dos numeros correctamente", () => {
    const resultado = suma(2, 3);
    expect(resultado).toBe(5);
  });

  test("Dado un divisible entre 3 deberia devolver Fizz", () => {
    const resultado = doFizzBuzz(3);
    expect(resultado).toBe("Fizz");
  });
});
