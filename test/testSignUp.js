import { Builder, By } from 'selenium-webdriver'; // Se importan las clases necesarias de Selenium WebDriver.
import chromedriver from 'chromedriver'; // Se importa el controlador de Chrome para Selenium.


const users = []; // Array vacío para insertar los datos de los usuarios.


for (let i = 1; i <= 50; i++) { 
    users.push({
        username: `user${i}`, // Username numerado.
        email: `email${i}@gmail.com`, // Email numerado.
        pass: `pass${i}` // Contraseña numerada acorde al email / número del usuario.
    });
}

// Función para automatizar el proceso.
async function testSignUp() {
    let driver = await new Builder().forBrowser('chrome').build(); // Se crea una instancia de WebDriver para Chrome.

    try {
        // Se recorre el array de users.
        for (const user of users) {
            await driver.get('http://localhost:3000/mtl/signup'); // Se accede a la página de registro.

            // Busca los campos del formulario y les envía los datos de cada usuario.

            await driver.findElement(By.id('username')).sendKeys(user.username); // Username del usuario.
            await driver.findElement(By.id('email')).sendKeys(user.email); // Email del usuario.
            await driver.findElement(By.id('pass')).sendKeys(user.pass); // Contraseña del usuario.
            await driver.findElement(By.id('role')).sendKeys('otaku'); // Rol: "otaku" (usuario básico).

            // Busca el botón de registro y hace click.
            await driver.findElement(By.css('.Signup__ButtonLog')).click();

            // Se muestra en la consola que el usuario se registró con éxito.
            console.log(`Registro exitoso para ${user.email}`);

            // 1 segundo de pausa antes de registrar al siguiente usuario.
            await driver.sleep(1000);
        }

    } catch (error) {
        console.error('Error al registrar:', error); // Si ocurre un error, se muestra.
    } finally {
        await driver.quit(); // Se cierra el navegador al finalizar la prueba.
    }
}

testSignUp(); // Llamada a la función.
