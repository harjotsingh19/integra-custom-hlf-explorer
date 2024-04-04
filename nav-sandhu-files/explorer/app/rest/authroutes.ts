/**
 *    SPDX-License-Identifier: Apache-2.0
 */
import passport from "passport";
import { helper } from "../common/helper";
import { responder } from "./requestutils";
import * as requtil from "./requestutils";

const logger = helper.getLogger("Auth");

/**
 *
 *
 * @param {*} router
 * @param {*} platform
 */
export async function authroutes(router: any, platform: any) {
	const proxy = platform.getProxy();
	const dbCrudService = platform.getPersistence().getCrudService();

	/**
	 * *
	 * Network list
	 * GET /networklist -> /login
	 * curl -i 'http://<host>:<port>/networklist'
	 */

	router.get(
		"/networklist",
		responder(async (req: any) => {
			const networkList = await proxy.networkList(req);
			return { networkList };
		})
	);

	/**
	 * *
	 * Login
	 * POST /login -> /login
	 * curl -X POST -H 'Content-Type: application/json' -d '{ 'user': '<user>', 'password': '<password>', 'network': '<network>' }' -i 'http://<host>:<port>/login'
	 */
	router.post("/login", async (req, res, next) => {
		logger.debug("req.body", req.body);
		return passport.authenticate("local-login", (err, token, userData) => {
			if (!token) {
				return res.status(400).json({
					success: false,
					message: userData.message
				});
			}
			return res.status(200).json({
				success: true,
				message: "You have successfully logged in!",
				token,
				user: userData
			});
		})(req, res, next);
	});

	router.post(
		"/logout",
		async (req: { body: any; logout: () => void }, res: { send: () => void }) => {
			logger.debug("req.body", req.body);
			req.logout();
			res.send();
		}
	);

	router.post("/logout", async (req, res) => {
		logger.debug("req.body", req.body);
		req.logout();
		res.send();
	});
	router.get("/blockDetail/:blockDataHash", (req, res) => {
		const blockDataHash = req.params.blockDataHash;
		if (blockDataHash) {
			dbCrudService
				.getBlockDetail(blockDataHash)
				.then(row => {
					if (row) {
						return res.send({
							status: 200,
							row
						});
					}
				})
				.catch(e => {
					res.send({
						status: 500,
						message: "Internal Server Error"
					});
				});
		} else {
			return requtil.invalidRequest(req, res);
		}
	});
	router.get("/txDetail/:txHashDetail", (req, res) => {
		const txHashDetail = req.params.txHashDetail;
		if (txHashDetail) {
			dbCrudService
				.getTransactionDetail(txHashDetail)
				.then(row => {
					if (row) {
						return res.send({
							status: 200,
							row
						});
					}
				})
				.catch(e => {
					res.send({
						status: 500,
						message: "Internal Server Error"
					});
				});
		} else {
			return requtil.invalidRequest(req, res);
		}
	});
}
