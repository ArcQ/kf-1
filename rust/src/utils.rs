// use cfg_if::cfg_if;
//
// cfg_if! {
//     // When the `console_error_panic_hook` feature is enabled, we can call the
//     // `set_panic_hook` function to get better error messages if we ever panic.
//     if #[cfg(feature = "console_error_panic_hook")] {
//         extern crate console_error_panic_hook;
//         pub use console_error_panic_hook::set_once as set_panic_hook;
//     } else {
//         #[inline]
//         pub fn set_panic_hook() {}
//     }
// }
//
// cfg_if! {
//     // When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
//     // allocator.
//     if #[cfg(feature = "wee_alloc")] {
//         extern crate wee_alloc;
//         #[global_allocator]
//         static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;
//     }
// }

#[allow(unused_macros)]
#[macro_export]
macro_rules! iflet {
    ([$p:pat = $e:expr], $($rest:tt),*) => {
        if let $p = $e {
            iflet!($($rest),*);
        }
    };
    ($b:block) => {
        $b
    };
}

#[macro_export]
macro_rules! unpack_storage {
    ($entity_option:expr, [$some_p:pat = mut $storage_option_from_hash:expr], $($rest:tt),*) => {
        if let Some(entity) = $entity_option {
            if let $some_p = $storage_option_from_hash.get_mut(*entity) {
                unpack_storage!($entity_option, $($rest),*);
            }
        }
    };
    ($entity_option:expr, [$some_p:pat = $storage_option_from_hash:expr], $($rest:tt),*) => {
        if let Some(entity) = $entity_option {
            if let $some_p = $storage_option_from_hash.get(*entity) {
                unpack_storage!($entity_option, $($rest),*);
            }
        }
    };
    ($entity:expr, $b:block) => {
        $b
    };
}

#[macro_export]
macro_rules! js_get {
    ($js_value:expr, $ok:pat, str $k:expr, $b:block) => {
        if let $ok = js_sys::Reflect::get($js_value, &wasm_bindgen::JsValue::from($k)) {
            $b
        }
    };
    ($init_config:expr, $ok:pat, f64 $k:expr, $b:block,*) => {
        if let $ok = js_sys::Reflect::get(init_config, &wasm_bindgen::JsValue::from($k)) {
            $b
        }
    };
}

#[macro_export]
macro_rules! js_get_in {
    ($v:expr, $alias:pat, str $k:expr, $b:block) => {
        js_get!($v, $alias, str $k, {
            $b
        });
    };
    ($v:expr, $alias:pat, str $k:expr, $($rest:tt)*) => {
        js_get!($v, Ok(inner_v), str $k, {
            js_get_in!(inner_v, $($rest)*);
        });
    };
}

#[macro_export]
macro_rules! js_get_mult {
    ($v:expr, $alias:pat, str $k:expr, $b:block) => {
        js_get!($v, $alias, str $k, {
            $b
        });
    };
    ($v:expr, $alias:pat, str $k:expr, $($rest:tt)*) => {
        js_get!($v, $alias, str $k, {
            js_get_mult!($v, $($rest)*);
        });
    };
}
