# Manual de Usuario — Ruby.

Ruby. es una tienda en línea de ropa y accesorios streetwear. Este manual explica, paso a paso y sin términos técnicos, cómo comprar en la tienda y cómo administrarla.

Sitio: https://like-jennie-seven.vercel.app

> **Nota:** la tienda es un proyecto académico. La compra es un **simulacro**: no se cobra dinero ni se envía ningún producto.

---

## Parte 1. Para clientes

### 1. Conocer la página de inicio

Al entrar verás:

1. **Encabezado** (arriba): el logo **Ruby.**, el menú **Tienda** con las categorías (Accesorios, Camisetas, Hoodies) y tres íconos: lupa (buscar), persona (cuenta) y bolsa (carrito).
2. **Portada** con el botón **Ver tienda**.
3. **Colección Fallen Angel**: una banda lila con el botón **Comprar ahora**.
4. **Destacados**: una selección de productos, con el botón **Ver todo**.
5. **Pie de página**: enlaces a la tienda por categoría y a las redes (Spotify, Instagram, YouTube).

El encabezado te acompaña mientras te desplazas por la página.

### 2. Explorar el catálogo

1. Pulsa **Tienda** en el menú, o **Ver tienda** en la portada.
2. Verás todos los productos con su foto, nombre y precio.
3. Para ver solo un tipo de prenda, pulsa una categoría (**Accesorios**, **Camisetas** o **Hoodies**) arriba de la lista, o en el menú del encabezado. **Todos** vuelve a mostrar todo.
4. Si un producto tiene precio de oferta, verás el precio original tachado y el nuevo en rojo.
5. Los productos sin existencias muestran la etiqueta **Agotado**.

### 3. Ver la colección Fallen Angel

Pulsa **Comprar ahora** en la banda lila de la página de inicio. Se abre una página con todos los productos de esa colección.

### 4. Buscar un producto

1. Pulsa la **lupa** del encabezado.
2. Escribe parte del nombre (por ejemplo, "hoodie"). Aparecen hasta 5 resultados con foto, nombre y precio.
3. Pulsa un resultado para abrir el producto, o **Ver todo el catálogo** para ir a la lista completa.
4. Para cerrar el buscador pulsa la **×**, haz clic fuera del cuadro o presiona la tecla **Esc**.

### 5. Ver el detalle de un producto

Pulsa cualquier producto. En su página puedes ver las fotos, la descripción y el precio, y elegir:

1. **Talla** y **color**. Solo se pueden combinar las opciones disponibles.
2. Si la combinación elegida no tiene existencias, aparecerá **Agotado en esta combinación**: prueba con otra talla o color.
3. Cuando la combinación está disponible, se habilita el botón para agregar al carrito.

### 6. Usar el carrito

1. Al agregar un producto se abre el carrito, un panel lateral lila. También puedes abrirlo con el ícono de **bolsa**; el número rojo indica cuántas prendas llevas.
2. Para cada producto puedes cambiar la cantidad con **−** y **+**, o quitarlo con **Quitar**.
3. Abajo verás el **Total**.
4. Si el carrito está vacío, aparece el mensaje "Tu carrito está vacío" y el botón **Seguir comprando**.

### 7. Finalizar la compra

1. En el carrito pulsa **Finalizar compra**.
2. Escribe tu **nombre** y tu **email**.
3. Pulsa **Confirmar pedido**.
4. Si todo sale bien verás **¡Pedido confirmado!** y el carrito queda vacío. El pedido descuenta las existencias.
5. Si alguna prenda ya no tiene existencias suficientes, verás un aviso en rojo; vuelve al carrito con **Volver al carrito** y ajusta la cantidad.

### 8. Panel de cuenta

El ícono de **persona** abre un panel con un campo de email y los botones **Pedidos** y **Perfil**. **El registro e inicio de sesión de clientes aún no está disponible**; el panel te lo indica con un aviso. Para comprar no necesitas cuenta.

---

## Parte 2. Para administradores

El panel de administración permite gestionar los productos y revisar el estado de la tienda. Es solo para el equipo de la tienda.

### 1. Ingresar

1. Entra a `/admin/login` (también hay un enlace **Acceso administrador** en el pie de página).
2. Escribe tu **email** y tu **contraseña** de administrador y pulsa para ingresar. Si no tienes credenciales, pídelas al equipo responsable.
3. Si los datos son incorrectos, verás el aviso "Credenciales inválidas".
4. Tu sesión dura 1 día. Para salir antes, pulsa **Cerrar sesión** en el menú del panel.

### 2. Dashboard (resumen)

La pantalla de inicio del panel muestra:

- **Productos activos**: cuántos productos están visibles en la tienda.
- **Variantes en alerta de stock**: cuántas combinaciones de talla y color tienen **5 unidades o menos** (incluidas las agotadas).
- **Órdenes totales**: cuántos pedidos se han hecho.
- **Alertas de stock**: la lista de las variantes que necesitan reposición. Si no hay ninguna, dice "Todo en orden".
- **Órdenes recientes**: los últimos pedidos, con el nombre del cliente. Si aún no hay, dice "Sin órdenes todavía".

### 3. Ver la lista de productos

Pulsa **Productos** en el menú del panel. La tabla muestra, por producto: **Nombre**, **Categoría**, **Precio**, **Stock total** y **Estado** (activo o no).

### 4. Crear un producto

1. En **Productos**, pulsa **+ Nuevo producto**.
2. Completa los datos:
   - **Nombre**, **slug** (el nombre que aparece en la dirección web, en minúsculas y con guiones, por ejemplo `hoodie-negro`) y **descripción**.
   - **Precio** y, si hay oferta, **precio de oferta**.
   - **Categoría**.
   - **Imagen**: pega la dirección web (URL) de la foto, que empieza por `https://`. La tienda no sube archivos: la imagen debe estar ya publicada en internet.
   - **Producto activo**: márcalo para que se vea en el catálogo. Si lo desmarcas, el producto queda oculto.
   - **Variantes**: para cada combinación escribe **Talla**, **Color** y **Stock**. Usa **+ Agregar variante** para añadir más.
3. Pulsa **Guardar**. El producto aparece en el catálogo si está activo.

### 5. Editar un producto

1. En la tabla, pulsa **Editar** en el producto.
2. Cambia los datos que necesites. En la edición se ajusta el **stock de cada variante** existente.
3. Pulsa **Guardar**.

### 6. Eliminar un producto

1. En la tabla, pulsa **Eliminar** en el producto.
2. Aparece la pregunta **¿Eliminar?** en la misma fila: confirma para borrarlo o cancela.
3. Al eliminarlo se borran también sus imágenes y variantes. Esta acción no se puede deshacer.

### 7. Reponer stock

Cuando una variante aparezca en **Alertas de stock**, entra a **Editar** en ese producto, actualiza el número de unidades de esa variante y pulsa **Guardar**. La alerta desaparece cuando el stock supera 5.

---

## Preguntas frecuentes

**¿Por qué no veo un producto en la tienda?** Puede estar desactivado: en el panel, edítalo y marca **Producto activo**.

**¿Por qué tarda en cargar la primera vez?** El servidor de la tienda se "duerme" cuando nadie lo usa. La primera visita puede tardar hasta un minuto; después responde normal.

**¿Se cobra la compra?** No. Es un simulacro de un proyecto académico.
